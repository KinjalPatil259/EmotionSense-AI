# 🧠 Intelligent Facial Emotion Analysis & Mood Enhancement System

A full-stack web application that detects facial emotions via webcam and provides personalized mood-enhancing messages.

**Frontend:** React 19 + Vite · **Backend:** Python Flask · **AI:** MobileNetV2 (TensorFlow) · **Database:** MongoDB

---

## 📁 Project Structure

```
Emotion/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── pages/     # Login, Register, Dashboard, Detect
│   │   ├── components/# Sidebar, EmotionCard, HistoryList, etc.
│   │   ├── App.jsx    # Router with auth guard
│   │   └── index.css  # Forest Calm theme
│   └── package.json
│
├── backend/           # Flask REST API
│   ├── routes/
│   │   ├── auth.py    # POST /register, POST /login
│   │   └── emotion.py # POST /detect-emotion, GET /history/<user_id>
│   ├── app.py         # Main app entry point
│   └── requirements.txt
│
├── model/             # AI model training & prediction
│   ├── train_model.py # MobileNetV2 transfer learning on Balanced FER-2013
│   ├── predict.py     # Base64 → face detection → emotion prediction
│   ├── messages.py    # Motivational message seeds (7 emotions × 7 messages)
│   └── model.h5       # Trained model (generated after training)
│
└── dataset/           # Balanced FER-2013
    ├── train/         # Training data
    ├── val/           # Validation data (updated)
    └── test/          # Final evaluation data
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.9
- **MongoDB**

### **🗄️ Database Setup (MongoDB)**
To see your data in MongoDB Compass, follow these steps:

1.  **Open MongoDB Compass**: Click "New Connection".
2.  **Connection String**: Use `mongodb://localhost:27017` and click **Connect**.
3.  **Create Data**: The `emotion_app` database only appears after you **Register a User** or perform your **First Scan**.
4.  **Verify**: Run `python verify_mongo.py` to check your connection status.

---

### **🚀 Running the Project**

### 1. Frontend

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
python app.py                # → http://localhost:5000
```

### 3. AI Model Training

1. Download the **Balanced FER-2013** dataset (75×75 images)
2. Organize into `dataset/train/` and `dataset/test/` with class subdirectories:
   `Angry/`, `Disgust/`, `Fear/`, `Happy/`, `Sad/`, `Surprise/`, `Neutral/`
3. Train:

```bash
cd model
python train_model.py
```

The trained model will be saved as `model/model.h5`.

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| **User Auth** | Register & login with hashed passwords |
| **Webcam Detection** | Real-time emotion detection via MobileNetV2 CNN |
| **7 Emotions** | Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral |
| **Motivational Messages** | Personalized messages per emotion from MongoDB |
| **Emotion History** | Track past detections with timestamps |
| **Dashboard Stats** | Total scans, most common emotion, avg confidence |

---

## 🎨 Forest Calm Theme

- Dark green palette: `#1F3D2B`, `#6B8E23`, `#0F1F17`
- Poppins typography
- Responsive sidebar layout
- Smooth hover animations
