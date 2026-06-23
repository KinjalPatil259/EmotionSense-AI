"""
Admin routes for system management.
Only accessible by users with the 'admin' role.
"""

from flask import Blueprint, jsonify, request
from bson import ObjectId
from datetime import datetime, timezone
from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # In a real JWT system, we'd verify the token here.
        # For this implementation, we check the 'X-Admin-Token' header 
        # or the 'role' in the request body/args as a simple gatekeeper.
        # The frontend will send the admin status.
        admin_token = request.headers.get('Authorization')
        if not admin_token or 'admin' not in admin_token.lower():
            return jsonify({"error": "Admin access required."}), 403
        return f(*args, **kwargs)
    return decorated_function

def init_admin_routes(db):
    admin_bp = Blueprint("admin", __name__)
    users_col = db["users"]
    emotions_col = db["emotions"] # Matches emotion.py
    messages_col = db["messages"]

    @admin_bp.route("/admin/login", methods=["POST"])
    def admin_login():
        """Special login for admin role check."""
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        from werkzeug.security import check_password_hash
        user = users_col.find_one({"email": email})
        
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials."}), 401
        
        if user.get("role") != "admin":
            return jsonify({"error": "Access denied. Admin role required."}), 403

        return jsonify({
            "message": "Admin login successful!",
            "token": "admin-jwt-token-simulated", # In real apps, generate a true JWT
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": "admin"
            }
        }), 200

    @admin_bp.route("/admin/dashboard", methods=["GET"])
    @admin_required
    def get_dashboard_stats():
        """Get system-wide statistics for dashboard."""
        total_users = users_col.count_documents({})
        total_emotions = emotions_col.count_documents({})
        total_messages = messages_col.count_documents({})
        
        # Recent activities (last 5 detections)
        recent_records = list(emotions_col.find().sort("timestamp", -1).limit(5))
        recent_activity = []
        for rec in recent_records:
            user = users_col.find_one({"_id": ObjectId(rec["user_id"])}) if "user_id" in rec else None
            recent_activity.append({
                "user": user["name"] if user else "Unknown",
                "emotion": rec["emotion"],
                "time": rec["timestamp"].isoformat() if isinstance(rec["timestamp"], datetime) else rec["timestamp"]
            })

        return jsonify({
            "stats": {
                "totalUsers": total_users,
                "totalEmotions": total_emotions,
                "totalMessages": total_messages
            },
            "recentActivity": recent_activity
        }), 200

    @admin_bp.route("/admin/users", methods=["GET"])
    @admin_required
    def get_users():
        """List all users."""
        all_users = list(users_col.find({}, {"password": 0}))
        for u in all_users:
            u["id"] = str(u["_id"])
            del u["_id"]
        return jsonify(all_users), 200

    @admin_bp.route("/admin/user/<id>", methods=["DELETE"])
    @admin_required
    def delete_user(id):
        """Delete a user and their history."""
        users_col.delete_one({"_id": ObjectId(id)})
        emotions_col.delete_many({"user_id": id})
        return jsonify({"message": "User deleted successfully."}), 200

    @admin_bp.route("/admin/user", methods=["POST"])
    @admin_required
    def add_user():
        """Admin can create new users manually."""
        from werkzeug.security import generate_password_hash
        data = request.get_json()
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        role = data.get("role", "user")

        if not name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        if users_col.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 409

        user_doc = {
            "name": name,
            "email": email,
            "password": generate_password_hash(password),
            "role": role,
            "created_at": datetime.now(timezone.utc)
        }
        users_col.insert_one(user_doc)
        return jsonify({"message": "User added successfully!"}), 201

    @admin_bp.route("/admin/user/<id>/role", methods=["PUT"])
    @admin_required
    def update_user_role(id):
        """Change a user's role (user -> admin or vice versa)."""
        data = request.get_json()
        new_role = data.get("role")

        if new_role not in ["user", "admin"]:
            return jsonify({"error": "Invalid role"}), 400

        users_col.update_one({"_id": ObjectId(id)}, {"$set": {"role": new_role}})
        return jsonify({"message": "User role updated."}), 200

    @admin_bp.route("/admin/messages", methods=["GET"])
    @admin_required
    def get_messages():
        """Fetch all motivational messages."""
        all_messages = list(messages_col.find())
        for m in all_messages:
            m["id"] = str(m["_id"])
            del m["_id"]
        return jsonify(all_messages), 200

    @admin_bp.route("/admin/message", methods=["POST"])
    @admin_required
    def add_message():
        """Add new motivational message."""
        data = request.get_json()
        emotion = data.get("emotion")
        message = data.get("message")
        
        if not emotion or not message:
            return jsonify({"error": "Missing fields"}), 400
            
        messages_col.insert_one({"emotion": emotion, "message": message})
        return jsonify({"message": "Message added successfully."}), 201

    @admin_bp.route("/admin/message/<id>", methods=["PUT"])
    @admin_required
    def update_message(id):
        """Update existing message."""
        data = request.get_json()
        messages_col.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"emotion": data.get("emotion"), "message": data.get("message")}}
        )
        return jsonify({"message": "Message updated."}), 200

    @admin_bp.route("/admin/message/<id>", methods=["DELETE"])
    @admin_required
    def delete_message(id):
        """Delete message."""
        messages_col.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Message deleted."}), 200

    @admin_bp.route("/admin/emotions", methods=["GET"])
    @admin_required
    def get_all_emotions():
        """View all detected emotions with optional filtering."""
        emotion_type = request.args.get("type")
        query = {"emotion": emotion_type} if emotion_type else {}
        
        records = list(emotions_col.find(query).sort("timestamp", -1))
        history = []
        for rec in records:
            user = users_col.find_one({"_id": ObjectId(rec["user_id"])}) if "user_id" in rec else None
            history.append({
                "id": str(rec["_id"]),
                "userName": user["name"] if user else "Guest",
                "emotion": rec["emotion"],
                "confidence": rec.get("confidence", 0),
                "timestamp": rec["timestamp"].isoformat() if isinstance(rec["timestamp"], datetime) else rec["timestamp"]
            })
        return jsonify(history), 200

    return admin_bp
