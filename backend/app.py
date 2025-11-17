from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)

url = os.getenv("MONGO")
client = MongoClient(url)
db = client["recruitment"]
users_collection = db["users"]
applications_collection = db["applications"]

users_collection.create_index("email", unique=True)

@app.route("/api/users/create", methods=["POST"])
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
def get_user(email):
    user = users_collection.find_one({"email": email}, {"_id": 0})
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

@app.route("/api/applications/get/<email>", methods=["GET"])
def get_applications(email):
    applications = list(applications_collection.find({"email": email}, {"_id": 0}))
    return jsonify(applications), 200

if __name__ == "__main__":
    app.run(debug=False, port=8000)
