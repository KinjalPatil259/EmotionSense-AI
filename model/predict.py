"""
Prediction pipeline for facial emotion detection.

Flow:
1. Decode base64 image to numpy array
2. Detect face using OpenCV Haar cascade
3. Crop, resize, and normalize the face
4. Predict emotion using loaded MobileNetV2 model
5. Return emotion label + confidence score
"""

import base64
import os
import cv2
import numpy as np

# Emotion labels matching FER-2013 dataset class order
EMOTION_LABELS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

# Path to Haar cascade for face detection
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

# Model input size — dataset is 75×75, resized to 96×96 for MobileNetV2
MODEL_INPUT_SIZE = (96, 96)


def decode_base64_image(base64_str: str) -> np.ndarray:
    """
    Decode a base64-encoded image string into an OpenCV-compatible numpy array.
    Handles data URI prefixes (e.g., 'data:image/png;base64,...').
    """
    # Strip data URI prefix if present
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]

    img_bytes = base64.b64decode(base64_str)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image from base64 string.")

    return img


def detect_face(img: np.ndarray):
    """
    Detect faces in the image using Haar cascade.
    Returns the largest face bounding box (x, y, w, h) or None.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )

    if len(faces) == 0:
        return None

    # Return the largest detected face
    faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
    return faces[0]


def preprocess_face(img: np.ndarray, face_box) -> np.ndarray:
    """
    Crop the face from the image, convert to RGB, resize, and normalize
    for model input.
    """
    x, y, w, h = face_box

    # Add some padding around the face
    pad = int(0.1 * max(w, h))
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(img.shape[1], x + w + pad)
    y2 = min(img.shape[0], y + h + pad)

    face_crop = img[y1:y2, x1:x2]

    # Convert BGR to RGB (MobileNetV2 expects RGB)
    face_rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)

    # Resize to model input size
    face_resized = cv2.resize(face_rgb, MODEL_INPUT_SIZE)

    # Normalize pixel values to [0, 1]
    face_normalized = face_resized.astype("float32") / 255.0

    # Add batch dimension
    face_batch = np.expand_dims(face_normalized, axis=0)

    return face_batch


def predict_emotion(model, base64_image: str) -> dict:
    """
    Full prediction pipeline: decode → detect face → preprocess → predict.

    Args:
        model: Loaded Keras model
        base64_image: Base64-encoded image string

    Returns:
        dict with 'emotion', 'confidence', and 'all_predictions' keys,
        or dict with 'error' key if face not detected.
    """
    # Step 1: Decode image
    img = decode_base64_image(base64_image)

    # Step 2: Detect face
    face_box = detect_face(img)
    if face_box is None:
        return {"error": "No face detected. Please ensure your face is clearly visible."}

    # Step 3: Preprocess
    face_input = preprocess_face(img, face_box)

    # Step 4: Predict
    predictions = model.predict(face_input, verbose=0)[0]

    # Step 5: Get top emotion
    emotion_idx = int(np.argmax(predictions))
    emotion_label = EMOTION_LABELS[emotion_idx]
    confidence = float(predictions[emotion_idx])

    # Build all predictions dict
    all_preds = {
        EMOTION_LABELS[i]: round(float(predictions[i]) * 100, 2)
        for i in range(len(EMOTION_LABELS))
    }

    return {
        "emotion": emotion_label,
        "confidence": round(confidence * 100, 2),
        "all_predictions": all_preds,
    }
