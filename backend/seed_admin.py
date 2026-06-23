"""
Seeding script to create an initial admin user and ensure all users have a 'role' field.
"""

import os
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.environ.get("DB_NAME", "emotion_app")

def seed_admin():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users_col = db["users"]

    print(f"Connecting to database: {DB_NAME}")

    # 1. Update existing users to have role: 'user' if not present
    result = users_col.update_many(
        {"role": {"$exists": False}},
        {"$set": {"role": "user"}}
    )
    print(f"Updated {result.modified_count} users with default role 'user'.")

    # 2. Check if admin exists
    admin_email = "admin@emotion.com"
    existing_admin = users_col.find_one({"email": admin_email})

    if not existing_admin:
        admin_user = {
            "name": "System Admin",
            "email": admin_email,
            "password": generate_password_hash("admin123"),
            "role": "admin"
        }
        users_col.insert_one(admin_user)
        print(f"✅ Created new admin user: {admin_email} (password: admin123)")
    else:
        # Ensure existing admin has the admin role
        users_col.update_one({"email": admin_email}, {"$set": {"role": "admin"}})
        print(f"✅ Admin user {admin_email} already exists and role is verified.")

    client.close()

if __name__ == "__main__":
    seed_admin()
