"""
Intelligent Facial Emotion Analysis and Mood Enhancement System
Main Flask application entry point.

- Connects to MongoDB
- Loads the trained emotion detection model
- Registers auth and emotion route blueprints
- Seeds motivational messages into the database
"""

import os
import sys

from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

# Add project root to path for model imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from routes.auth import init_auth_routes
from routes.emotion import init_emotion_routes
from routes.admin import init_admin_routes
from model.messages import seed_messages

# ──────────────────────────────── Configuration ────────────────────────────────

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.environ.get("DB_NAME", "emotion_app")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "model.h5")

# ──────────────────────────────── App Setup ────────────────────────────────────

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
print(f"✅ Connected to MongoDB: {DB_NAME}")

# Seed motivational messages into the database
seed_messages(db)

# ──────────────────────────────── Load AI Model ────────────────────────────────

emotion_model = None

if os.path.exists(MODEL_PATH):
    try:
        from tensorflow.keras.models import load_model

        emotion_model = load_model(MODEL_PATH)
        print(f"✅ Emotion model loaded from: {MODEL_PATH}")
    except Exception as e:
        print(f"⚠️  Could not load model: {e}")
        print("   The /detect-emotion endpoint will not work until a valid model is provided.")
else:
    print(f"⚠️  Model file not found at: {MODEL_PATH}")
    print("   Train the model first:  python model/train_model.py")
    print("   The /detect-emotion endpoint will not work until a valid model is provided.")

# ──────────────────────────────── Register Routes ──────────────────────────────

# Register Blueprints
app.register_blueprint(init_auth_routes(db), url_prefix="/")
app.register_blueprint(init_emotion_routes(db, emotion_model), url_prefix="/")
app.register_blueprint(init_admin_routes(db), url_prefix="/")

# ──────────────────────────────── Health Check ─────────────────────────────────

@app.route("/", methods=["GET"])
def health_check():
    """Simple health check endpoint."""
    return {
        "status": "running",
        "service": "Emotion Analysis API",
        "model_loaded": emotion_model is not None,
    }

# ──────────────────────────────── Run ──────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
