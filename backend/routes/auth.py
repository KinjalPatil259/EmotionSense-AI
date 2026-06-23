"""
Authentication routes: user registration and login.
Passwords are securely hashed using Werkzeug.
"""

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)


def init_auth_routes(db):
    """Initialize auth routes with database reference."""
    users = db["users"]

    @auth_bp.route("/register", methods=["POST"])
    def register():
        """
        Register a new user.
        Expects JSON: { name, email, password }
        """
        data = request.get_json()

        # Validate required fields
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name or not email or not password:
            return jsonify({"error": "Name, email, and password are required."}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters."}), 400

        # Check if user already exists
        if users.find_one({"email": email}):
            return jsonify({"error": "An account with this email already exists."}), 409

        # Create user with hashed password
        user_doc = {
            "name": name,
            "email": email,
            "password": generate_password_hash(password),
        }
        result = users.insert_one(user_doc)

        return jsonify({
            "message": "Registration successful!",
            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email,
            }
        }), 201

    @auth_bp.route("/login", methods=["POST"])
    def login():
        """
        Authenticate a user.
        Expects JSON: { email, password }
        """
        data = request.get_json()

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        # Find user by email
        user = users.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid email or password."}), 401

        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user.get("role", "user"),
            }
        }), 200

    return auth_bp
