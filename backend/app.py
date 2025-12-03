import os
import json
from datetime import datetime, timedelta
from functools import lru_cache
from typing import List, Optional, Dict, Any

import jwt
import requests
from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, HTTPException, Request, status, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, ReturnDocument
from pymongo.collection import Collection
from bson import ObjectId

# Import RAG handler
try:
    from rag import ChatHandler
except ImportError:
    ChatHandler = None

# Import Google Sheets Roster Loader
try:
    from google_sheets import fetch_roster_from_sheets
except ImportError:
    fetch_roster_from_sheets = None

load_dotenv()

@lru_cache()
def get_settings():
    """Simple settings loader."""
    mongo_uri = os.getenv("MONGO") or os.getenv("MONGODB_URI")
    if not mongo_uri:
        print("WARNING: MONGO environment variable not set.")
        mongo_uri = "mongodb://localhost:27017"
    
    return {
        "mongo_uri": mongo_uri,
        "google_api_key": os.getenv("GOOGLE_API_KEY"),
        "jwt_secret": os.getenv("JWT_SECRET", "dev-secret"),
        "clerk_secret": os.getenv("CLERK_SECRET_KEY", "sk_test_1u0fLiKqdZsGWR52WCJgYehw5msMUbdcJSfiAcM07D")
    }


settings = get_settings()

# Database setup
client = MongoClient(settings["mongo_uri"])
db = client["recruitment"]
users_collection: Collection = db["users"]
applications_collection: Collection = db["applications"]
decisions_collection: Collection = db["decisions"]

# Ensure indexes
users_collection.create_index("email", unique=True)
applications_collection.create_index("email")
applications_collection.create_index("branch")
applications_collection.create_index("status")

# Initialize Chat Handler
chat_handler = ChatHandler(settings["google_api_key"]) if ChatHandler and settings["google_api_key"] else None

# Load Roster
ROSTER = []
try:
    with open("data/roster.json", "r") as f:
        ROSTER = json.load(f)
    print(f"Loaded {len(ROSTER)} staff members from roster.")
except Exception as e:
    print(f"Warning: Could not load roster.json: {e}")
    ROSTER = []


def get_roster_user(email: str):
    """Find user in roster by email (case-insensitive)."""
    if not email: 
        return None
    email = email.lower()
    for user in ROSTER:
        if user.get("email", "").lower() == email:
            return user
    return None


# FastAPI application
app = FastAPI(title="Generate Recruitment Backend", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    """Load roster from Google Sheets on startup"""
    if fetch_roster_from_sheets:
        print("Fetching roster from Google Sheets...")
        try:
            fetch_roster_from_sheets()
        except Exception as e:
            print(f"Startup Roster Fetch Failed: {e}")
            
    # Reload global ROSTER variable
    global ROSTER
    try:
        with open("data/roster.json", "r") as f:
            ROSTER = json.load(f)
        print(f"Loaded {len(ROSTER)} staff members.")
    except:
        print("No roster.json found.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Dependencies ---

async def verify_clerk_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        # Allow for public endpoints like chat? No, Chat is usually public but let's be safe.
        # For strict endpoints, we'll fail.
        return {} # Return empty if no token, endpoint logic decides

    try:
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        # Decode without verify for MVP speed
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user_email(token: dict = Depends(verify_clerk_token)):
    return token.get("email") or token.get("sub")


# --- Auth / Roster Routes ---

@app.get("/api/auth/me")
def get_current_user_info(token: dict = Depends(verify_clerk_token)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    email = token.get("email") or token.get("sub") # Clerk usually puts email in 'email' or via 'sub' lookup
    # If Clerk token doesn't have email directly (it might not), we might need to fetch from Clerk API or DB.
    # For MVP, we assume the token payload has 'email' or 'primary_email_address'.
    # Let's try to find it.
    
    roster_user = get_roster_user(email)
    
    if not roster_user:
        return {
            "authorized": False,
            "email": email,
            "role": "Applicant",
            "branch": None
        }
        
    return {
        "authorized": True,
        "email": email,
        "role": roster_user["role"],
        "branch": roster_user["branch"],
        "name": roster_user["name"]
    }


# --- Form Builder Routes ---

@app.get("/api/forms/questions")
def get_form_questions(
    branch: str = Query(...),
    role: str = Query(...)
):
    """
    Get dynamic questions based on Branch and Role.
    Merges: Global Default + Branch Default + Role Specific
    """
    try:
        with open("data/questions.json", "r") as f:
            all_questions = json.load(f)
    except Exception as e:
        print(f"Error loading questions: {e}")
        return []

    questions = []
    
    # 1. Global Defaults
    if "default" in all_questions:
        questions.extend(all_questions["default"])
        
    # 2. Branch Defaults
    branch_data = all_questions.get("branches", {}).get(branch, {})
    if "default" in branch_data:
        questions.extend(branch_data["default"])
        
    # 3. Role Specific
    # Handle "Chief", "Lead", "Member" mapping if exact match not found
    # Simple keyword matching
    role_key = role
    if "chief" in role.lower(): role_key = "Chief"
    elif "lead" in role.lower(): role_key = "Lead"
    elif "member" in role.lower(): role_key = "Member"
    
    role_questions = branch_data.get("roles", {}).get(role_key, [])
    questions.extend(role_questions)
    
    return questions


# --- Application Routes ---

@app.post("/api/applications/create")
def create_application(
    data: dict = Body(...),
    user_token: dict = Depends(verify_clerk_token)
):
    required_fields = ["email", "role", "branch"]
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    application = {
        "email": data["email"],
        "role": data["role"],
        "branch": data["branch"],
        "branchColor": data.get("branchColor", ""),
        "status": "submitted",
        "submittedAt": datetime.utcnow(),
        "timestamps": {
            "submitted": datetime.utcnow()
        },
        "formData": data.get("formData", {}),
        "isSubmitted": True
    }

    result = applications_collection.insert_one(application)
    application["_id"] = str(result.inserted_id)

    # No email sent (per user request)
    
    return {"message": "Application submitted", "application": application}


@app.get("/api/applications/get/{email}")
def get_applications_by_email(
    email: str,
    user_token: dict = Depends(verify_clerk_token)
):
    # In MVP we blindly trust the email param matches the user, 
    # or simple check:
    # token_email = user_token.get("email")
    # if token_email and token_email != email: raise 403
    
    apps = list(applications_collection.find({"email": email}))
    for doc in apps:
        doc["_id"] = str(doc["_id"])
    return apps

@app.get("/api/applications/{app_id}")
def get_application_detail(app_id: str):
    try:
        oid = ObjectId(app_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
    doc = applications_collection.find_one({"_id": oid})
    if doc:
        doc["_id"] = str(doc["_id"])
        return doc
    raise HTTPException(status_code=404)


# --- Review Routes (Hierarchy Enforced) ---

@app.get("/api/review/queue/{branch}")
def get_review_queue(
    branch: str,
    user_token: dict = Depends(verify_clerk_token)
):
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    
    if not roster_user:
        raise HTTPException(status_code=403, detail="Access Denied: Not in staff roster.")
    
    # Hierarchy Check
    user_role = roster_user.get("role", "").lower()
    user_branch = roster_user.get("branch", "").lower()
    
    # Executive Director sees all
    if "executive" in user_role:
        pass # No filter restrictions
    elif user_branch != branch.lower():
         raise HTTPException(status_code=403, detail=f"Access Denied: You belong to {user_branch}, not {branch}.")

    # Role Filtering
    # Logic: 
    # Director -> Sees "Chief" or "Lead" applications
    # Chief -> Sees "Member" (anything else)
    
    filter_regex = ""
    
    if "director" in user_role and "executive" not in user_role:
        # Director sees Chiefs and Leads
        filter_regex = "chief|lead|head"
    elif "chief" in user_role:
        # Chief sees Members (Not Chief, Not Director)
        # Easier to just say: Not Chief, Not Director
        # But regex for "not" is hard in basic find without $not.
        # Let's fetch and filter in python for MVP simplicity/flexibility
        pass
    
    # Base Query
    cutoff = datetime.utcnow() - timedelta(hours=2)
    query = {
        "branch": {"$regex": f"^{branch}$", "$options": "i"}, # Case insensitive branch match
        "status": {"$in": ["submitted", "under_review"]},
        "$or": [
            {"claimed_by": {"$exists": False}},
            {"claimed_at": {"$lt": cutoff}},
            {"claimed_by": email} # Show apps I claimed
        ]
    }
    
    cursor = applications_collection.find(query).limit(100)
    apps = []
    
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        app_role = doc.get("role", "").lower()
        
        include = True
        if "director" in user_role and "executive" not in user_role:
            # Only show Chiefs/Leads
            if not ("chief" in app_role or "lead" in app_role):
                include = False
        elif "chief" in user_role:
            # Only show Members (NOT chiefs/directors)
            if "chief" in app_role or "director" in app_role:
                include = False
                
        if include:
            apps.append(doc)

    return apps


@app.post("/api/review/claim/{app_id}")
def claim_application(
    app_id: str,
    user_token: dict = Depends(verify_clerk_token)
):
    email = user_token.get("email")
    if not get_roster_user(email):
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        oid = ObjectId(app_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    # Claim logic
    app = applications_collection.find_one({"_id": oid})
    if not app: raise HTTPException(404)
    
    cutoff = datetime.utcnow() - timedelta(hours=2)
    if app.get("claimed_by") and app.get("claimed_by") != email:
        if app.get("claimed_at") and app["claimed_at"] > cutoff:
             raise HTTPException(409, detail="Already claimed")

    applications_collection.update_one(
        {"_id": oid},
        {"$set": {"claimed_by": email, "claimed_at": datetime.utcnow(), "status": "under_review"}}
    )
    return {"message": "Claimed"}


@app.post("/api/review/decision/{app_id}")
def submit_decision(
    app_id: str,
    decision_data: dict = Body(...),
    user_token: dict = Depends(verify_clerk_token)
):
    email = user_token.get("email")
    if not get_roster_user(email):
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        oid = ObjectId(app_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    decision_record = {
        "application_id": str(oid),
        "reviewer_email": email,
        "decision": decision_data["decision"],
        "notes": decision_data.get("notes", ""),
        "timestamp": datetime.utcnow()
    }
    decisions_collection.insert_one(decision_record)
    
    update_op = {
        "$set": {
            "status": decision_data["decision"],
            "claimed_by": None, 
            "claimed_at": None
        },
        "$push": {"history": decision_record}
    }
    
    # Also add to main notes if text provided
    if decision_data.get("notes"):
        roster_user = get_roster_user(email)
        note_entry = {
            "author": roster_user["name"] if roster_user else email,
            "email": email,
            "content": f"[Decision: {decision_data['decision'].upper()}] {decision_data['notes']}",
            "timestamp": datetime.utcnow()
        }
        # We need to push to both history and notes. 
        # MongoDB allows multiple pushes to different fields in one op? 
        # Yes, using $push: { field1: val1, field2: val2 }
        update_op["$push"]["notes"] = note_entry

    applications_collection.update_one(
        {"_id": oid},
        update_op
    )
    return {"message": "Decision recorded"}


# --- Notes & Reports Routes ---

@app.post("/api/applications/{app_id}/notes")
def add_application_note(
    app_id: str,
    note_data: dict = Body(...),
    user_token: dict = Depends(verify_clerk_token)
):
    """
    Add a standalone note to an application.
    Expects: { "note": "..." }
    """
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    try:
        oid = ObjectId(app_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    note_entry = {
        "author": roster_user["name"],
        "email": email,
        "content": note_data.get("note"),
        "timestamp": datetime.utcnow()
    }
    
    applications_collection.update_one(
        {"_id": oid},
        {"$push": {"notes": note_entry}}
    )
    
    return {"message": "Note added", "entry": note_entry}


@app.get("/api/reports/branch-notes/{branch}")
def get_branch_notes_report(
    branch: str,
    user_token: dict = Depends(verify_clerk_token)
):
    """
    Get a structured report of all notes for a branch, grouped by Role.
    """
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Check if user belongs to branch (or is executive)
    if "executive" not in roster_user["role"].lower() and roster_user["branch"].lower() != branch.lower():
        raise HTTPException(status_code=403, detail="Access denied to this branch.")

    # Fetch all apps for branch
    cursor = applications_collection.find(
        {"branch": {"$regex": f"^{branch}$", "$options": "i"}}
    ).sort("role", 1)
    
    report = {}
    
    for doc in cursor:
        role = doc.get("role", "Unknown Role")
        if role not in report:
            report[role] = []
            
        # Format application summary
        full_name = f"{doc.get('formData', {}).get('firstName', '')} {doc.get('formData', {}).get('lastName', '')}".strip()
        if not full_name: full_name = doc.get("email")
        
        app_summary = {
            "id": str(doc["_id"]),
            "name": full_name,
            "email": doc.get("email"),
            "status": doc.get("status"),
            "notes": doc.get("notes", []),
            # Include decision history notes too if needed, but let's stick to explicit notes for clarity
            "decisions": doc.get("history", [])
        }
        
        report[role].append(app_summary)
        
    return report


# --- Admin Routes (Exec Only) ---

@app.get("/api/admin/questions")
def get_all_questions(user_token: dict = Depends(verify_clerk_token)):
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user or "executive" not in roster_user.get("role", "").lower():
        raise HTTPException(status_code=403, detail="Admin access only")
        
    try:
        with open("data/questions.json", "r") as f:
            return json.load(f)
    except:
        return {}

@app.post("/api/admin/questions")
def update_questions(
    questions: dict = Body(...),
    user_token: dict = Depends(verify_clerk_token)
):
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user or "executive" not in roster_user.get("role", "").lower():
        raise HTTPException(status_code=403, detail="Admin access only")

    with open("data/questions.json", "w") as f:
        json.dump(questions, f, indent=2)
    return {"message": "Questions updated"}

@app.get("/api/admin/roster")
def get_roster(user_token: dict = Depends(verify_clerk_token)):
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user or "executive" not in roster_user.get("role", "").lower():
        raise HTTPException(status_code=403, detail="Admin access only")
    return ROSTER

@app.post("/api/admin/roster")
def update_roster(
    new_roster: List[dict] = Body(...),
    user_token: dict = Depends(verify_clerk_token)
):
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user or "executive" not in roster_user.get("role", "").lower():
        raise HTTPException(status_code=403, detail="Admin access only")
        
    global ROSTER
    ROSTER = new_roster
    with open("data/roster.json", "w") as f:
        json.dump(ROSTER, f, indent=2)
    return {"message": "Roster updated"}

@app.post("/api/admin/reset")
def seasonal_reset(
    confirmation: dict = Body(...),
    user_token: dict = Depends(verify_clerk_token)
):
    email = user_token.get("email")
    roster_user = get_roster_user(email)
    if not roster_user or "executive" not in roster_user.get("role", "").lower():
        raise HTTPException(status_code=403, detail="Admin access only")
        
    if confirmation.get("confirm") != "I CONFIRM SEASONAL RESET":
        raise HTTPException(400, detail="Invalid confirmation code")
        
    # Archive current applications (or delete for MVP)
    # For MVP, we'll just delete them to 'reset' the season
    count = applications_collection.count_documents({})
    applications_collection.delete_many({})
    decisions_collection.delete_many({})
    
    return {"message": f"Seasonal reset complete. {count} applications archived/deleted."}


# --- Chatbot ---

@app.post("/api/chat")
async def chat_endpoint(body: dict = Body(...)):
    message = body.get("message")
    if not message: raise HTTPException(400)
    
    if not chat_handler:
        return {"response": "Chat system offline (Check API Key).", "sources": []}
        
    return await chat_handler.get_response(message)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
