from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)

url = os.getenv("MONGO")
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
import jwt
import requests
from functools import wraps
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

url = os.getenv("MONGO")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
client = MongoClient(url)
db = client["recruitment"]
users_collection = db["users"]
applications_collection = db["applications"]

users_collection.create_index("email", unique=True)

@app.route("/api/users/create", methods=["POST"])
# Clerk JWT verification middleware
def verify_clerk_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "No authorization header"}), 401
        
        try:
            # Extract token from "Bearer <token>"
            token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
            
            # Decode the JWT header to get the key ID (kid)
            unverified_header = jwt.get_unverified_header(token)
            
            # Get the issuer from the token to construct JWKS URL
            unverified_claims = jwt.decode(token, options={"verify_signature": False})
            issuer = unverified_claims.get('iss')
            
            if not issuer:
                return jsonify({"error": "Token missing issuer"}), 401
            
            # Fetch JWKS from Clerk
            jwks_url = f"{issuer}/.well-known/jwks.json"
            jwks_response = requests.get(jwks_url)
            jwks = jwks_response.json()
            
            # Find the correct key
            key_id = unverified_header.get('kid')
            public_key = None
            
            for key in jwks.get('keys', []):
                if key.get('kid') == key_id:
                    # Convert JWK to PEM format
                    from jwt.algorithms import RSAAlgorithm
                    public_key = RSAAlgorithm.from_jwk(key)
                    break
            
            if not public_key:
                return jsonify({"error": "Unable to find appropriate key"}), 401
            
            # Verify and decode the token
            decoded_token = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                options={"verify_signature": True}
            )
            
            # Add user info to request context
            request.clerk_user = decoded_token
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            return jsonify({"error": f"Authentication error: {str(e)}"}), 401
    
    return decorated_function

@app.route("/api/users/create", methods=["POST"])
@verify_clerk_token
def create_user():
    try:
        data = request.get_json()
        
        required_fields = ["email", "name", "year", "major"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        user = {
            "email": data["email"],
            "name": data["name"],
            "year": data["year"],
            "major": data["major"]
        }
        
        result = users_collection.insert_one(user)
        user["_id"] = str(result.inserted_id)
        
        return jsonify({
            "message": "User created successfully",
            "user": user
        }), 201
        
    except Exception as e:
        if "duplicate key error" in str(e):
            return jsonify({"error": "User with this email already exists"}), 409

@app.route("/api/applications/create", methods=["POST"])
def create_application():
    try:
        data = request.get_json()
        if "email" not in data:
            return jsonify({"error": "Missing field: email"}), 400
        if "essays" not in data:
            return jsonify({"error": "Missing field: essays"}), 400
        if not isinstance(data["essays"], list):
            return jsonify({"error": "Essays must be an array of strings"}), 400
        
        user = users_collection.find_one({"email": data["email"]})
        if not user:
            return jsonify({"error": "User with this email does not exist"}), 404
        
        application = {
            "email": data["email"],
            "essays": data["essays"]
@verify_clerk_token
def create_application():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["email", "role", "branch"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        # Check if user exists, if not create one
        user = users_collection.find_one({"email": data["email"]})
        if not user and "formData" in data:
            # Auto-create user from form data
            user_data = {
                "email": data["email"],
                "name": f"{data['formData'].get('firstName', '')} {data['formData'].get('lastName', '')}",
                "year": data['formData'].get('year', ''),
                "major": data['formData'].get('major', '')
            }
            users_collection.insert_one(user_data)
        
        # Create application with all data
        application = {
            "email": data["email"],
            "role": data["role"],
            "branch": data["branch"],
            "branchColor": data.get("branchColor", ""),
            "status": data.get("status", "submitted"),
            "submittedAt": data.get("submittedAt", ""),
            "timestamps": data.get("timestamps", {}),
            "formData": data.get("formData", {}),
            "isSubmitted": data.get("isSubmitted", True)
        }
        
        result = applications_collection.insert_one(application)
        application["_id"] = str(result.inserted_id)
        
        return jsonify({
            "message": "Application created successfully",
            "application": application
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/get/<email>", methods=["GET"])
@verify_clerk_token
def get_user(email):
    user = users_collection.find_one({"email": email}, {"_id": 0})
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

@app.route("/api/applications/get/<email>", methods=["GET"])
@verify_clerk_token
def get_applications(email):
    applications = list(applications_collection.find({"email": email}, {"_id": 0}))
    return jsonify(applications), 200

if __name__ == "__main__":
    app.run(debug=False, port=8000)
    app.run(debug=False, port=8000)
