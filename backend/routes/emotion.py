"""
Emotion detection and history routes.
Handles image processing, prediction, message retrieval from DB, and history storage.
"""

import random
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify
from bson import ObjectId

import sys, os

# Add project root to path so we can import the model module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from model.predict import predict_emotion

emotion_bp = Blueprint("emotion", __name__)


def init_emotion_routes(db, model):
    """Initialize emotion routes with database and model references."""
    emotions_col = db["emotions"]
    messages_col = db["messages"]

    @emotion_bp.route("/detect-emotion", methods=["POST"])
    def detect_emotion():
        """
        Detect emotion from a base64-encoded image.
        Expects JSON: { user_id, image }
        Returns: { emotion, confidence, message, all_predictions }
        """
        data = request.get_json()

        user_id = data.get("user_id", "")
        image_b64 = data.get("image", "")

        if not image_b64:
            return jsonify({"error": "No image provided."}), 400

        # Run prediction pipeline
        result = predict_emotion(model, image_b64)

        if "error" in result:
            return jsonify(result), 400

        emotion = result["emotion"]

        # Fetch a random message from MongoDB for this emotion
        pipeline = [
            {"$match": {"emotion": emotion}},
            {"$sample": {"size": 1}},
        ]
        msg_docs = list(messages_col.aggregate(pipeline))
        message = msg_docs[0]["message"] if msg_docs else "Stay positive and keep going!"

        # Save to emotion history if user_id provided
        if user_id:
            emotions_col.insert_one({
                "user_id": user_id,
                "emotion": emotion,
                "confidence": result["confidence"],
                "message": message,
                "timestamp": datetime.now(timezone.utc),
            })

        return jsonify({
            "emotion": emotion,
            "confidence": result["confidence"],
            "message": message,
            "all_predictions": result["all_predictions"],
        }), 200

    @emotion_bp.route("/history/<user_id>", methods=["GET"])
    def get_history(user_id):
        """
        Get emotion detection history for a user.
        Returns the most recent 50 entries, newest first.
        """
        records = list(
            emotions_col.find({"user_id": user_id})
            .sort("timestamp", -1)
            .limit(50)
        )

        history = []
        for rec in records:
            history.append({
                "id": str(rec["_id"]),
                "emotion": rec["emotion"],
                "confidence": rec.get("confidence", 0),
                "message": rec.get("message", ""),
                "timestamp": rec["timestamp"].isoformat(),
            })

        return jsonify({"history": history}), 200

    return emotion_bp
