from pymongo import MongoClient

def verify_connection():
    try:
        # Default local URI
        uri = "mongodb://localhost:27017/"
        client = MongoClient(uri, serverSelectionTimeoutMS=2000)
        
        # Check connection
        client.admin.command('ping')
        print("✅ Success: Connected to MongoDB at localhost:27017")
        
        # Check database and collections
        db = client["emotion_app"]
        collections = db.list_collection_names()
        print(f"📂 Database 'emotion_app' found with collections: {collections}")
        
        if "messages" in collections:
            count = db["messages"].count_documents({})
            print(f"📊 Messages collection has {count} documents.")
        else:
            print("⚠️  'messages' collection not found. Run 'python backend/app.py' to seed it.")
            
        client.close()
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        print("\nEnsure MongoDB is running (check Services or run 'mongod' in a terminal).")

if __name__ == "__main__":
    verify_connection()
