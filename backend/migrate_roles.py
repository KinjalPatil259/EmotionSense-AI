"""
Migration script to add the 'role' field to existing users in MongoDB.
Run this script once to ensure all users have a default role.
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(backend_dir, ".env"))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "emotion_app")

def migrate():
    print(f"🔍 Connecting to MongoDB: {DB_NAME}...")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users = db["users"]

    # Update all users that don't have a 'role' field
    result = users.update_many(
        {"role": {"$exists": False}},
        {"$set": {"role": "user"}}
    )

    print(f"✅ Migration complete!")
    print(f"📊 Users updated: {result.modified_count}")
    client.close()

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
