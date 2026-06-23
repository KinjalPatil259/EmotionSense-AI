from pymongo import MongoClient

SEED_MESSAGES = [
    # ── Angry ──
    {"emotion": "Angry", "message": "Take a deep breath. This feeling will pass like clouds in the sky."},
    {"emotion": "Angry", "message": "Channel your energy into something creative. You have so much power within you."},
    {"emotion": "Angry", "message": "It's okay to feel angry. Acknowledge it, then let it go gently."},
    {"emotion": "Angry", "message": "Step outside for a moment. Nature has a way of calming the storm inside."},
    {"emotion": "Angry", "message": "Remember: you are bigger than this moment. Peace is always within reach."},
    {"emotion": "Angry", "message": "Try counting to ten slowly. Each number brings you closer to calm."},
    {"emotion": "Angry", "message": "Your strength isn't in your anger — it's in how you choose to respond."},

    # ── Disgust ──
    {"emotion": "Disgust", "message": "Not everything deserves your energy. Focus on what brings you joy."},
    {"emotion": "Disgust", "message": "You have the power to choose what you engage with. Choose wisely."},
    {"emotion": "Disgust", "message": "Let go of what doesn't serve you. Your peace matters most."},
    {"emotion": "Disgust", "message": "Shift your focus to something beautiful — a flower, a song, a memory."},
    {"emotion": "Disgust", "message": "It's okay to walk away from things that don't feel right."},
    {"emotion": "Disgust", "message": "Your sense of standards is a strength. Use it to find better paths."},
    {"emotion": "Disgust", "message": "Close your eyes and think of three things you're grateful for right now."},

    # ── Fear ──
    {"emotion": "Fear", "message": "Courage is not the absence of fear — it's taking a step despite it."},
    {"emotion": "Fear", "message": "You've overcome challenges before, and you'll overcome this one too."},
    {"emotion": "Fear", "message": "Fear is just excitement without breath. Breathe deeply and feel the shift."},
    {"emotion": "Fear", "message": "You are safe in this moment. Ground yourself and feel the earth beneath you."},
    {"emotion": "Fear", "message": "Every brave person you admire has felt exactly what you're feeling now."},
    {"emotion": "Fear", "message": "Think of fear as a compass — it often points toward growth."},
    {"emotion": "Fear", "message": "You are stronger than you think. Trust yourself."},

    # ── Happy ──
    {"emotion": "Happy", "message": "Your smile lights up the world! Keep spreading that beautiful energy."},
    {"emotion": "Happy", "message": "Happiness looks amazing on you. Enjoy every second of this feeling!"},
    {"emotion": "Happy", "message": "What a wonderful moment! Hold onto this feeling and share it with others."},
    {"emotion": "Happy", "message": "You radiate positivity! The world needs more of your energy."},
    {"emotion": "Happy", "message": "This joy you feel? You deserve every bit of it. Celebrate yourself!"},
    {"emotion": "Happy", "message": "Keep shining! Your happiness is contagious and inspiring."},
    {"emotion": "Happy", "message": "Life is beautiful, and so is your smile. Keep it going!"},

    # ── Sad ──
    {"emotion": "Sad", "message": "It's okay to feel sad. Your emotions are valid, and brighter days are coming."},
    {"emotion": "Sad", "message": "Every storm runs out of rain. Hold on — sunshine is on its way."},
    {"emotion": "Sad", "message": "You are not alone in this. Reach out to someone who cares about you."},
    {"emotion": "Sad", "message": "Sadness is temporary, but your strength is permanent. You'll get through this."},
    {"emotion": "Sad", "message": "Be gentle with yourself today. You deserve the same kindness you give others."},
    {"emotion": "Sad", "message": "Sometimes the bravest thing you can do is simply keep going. You're doing great."},
    {"emotion": "Sad", "message": "Remember: even the darkest night will end, and the sun will rise again."},

    # ── Surprise ──
    {"emotion": "Surprise", "message": "Life is full of unexpected moments! Embrace the wonder of the unknown."},
    {"emotion": "Surprise", "message": "What an exciting moment! Stay curious — the best surprises are yet to come."},
    {"emotion": "Surprise", "message": "Surprise keeps life interesting! Enjoy the unexpected twists and turns."},
    {"emotion": "Surprise", "message": "The universe has a way of surprising us. Stay open to new possibilities!"},
    {"emotion": "Surprise", "message": "Wow, what a moment! Let the excitement fuel your curiosity."},
    {"emotion": "Surprise", "message": "Every surprise is a reminder that life is wonderfully unpredictable."},
    {"emotion": "Surprise", "message": "Stay amazed! A curious mind is a happy mind."},

    # ── Neutral ──
    {"emotion": "Neutral", "message": "A calm mind is a powerful mind. Enjoy this moment of balance."},
    {"emotion": "Neutral", "message": "Stillness is a superpower. Use this clarity to set your intentions."},
    {"emotion": "Neutral", "message": "You're in a peaceful place. What would you like to create from here?"},
    {"emotion": "Neutral", "message": "Balance is beautiful. Take this moment to reflect on what matters most."},
    {"emotion": "Neutral", "message": "In the quiet, you find your strength. Enjoy this tranquil moment."},
    {"emotion": "Neutral", "message": "A neutral state is the perfect canvas. Paint it with something meaningful."},
    {"emotion": "Neutral", "message": "You're centered and grounded. This is the perfect time for mindful thinking."},
]


def seed_messages(db):
    """
    Populate the 'messages' collection if it is empty.
    Skips seeding if messages already exist.
    """
    collection = db["messages"]
    if collection.count_documents({}) == 0:
        collection.insert_many(SEED_MESSAGES)
        print(f"✅ Seeded {len(SEED_MESSAGES)} messages into MongoDB.")
    else:
        print("ℹ️  Messages collection already populated. Skipping seed.")


if __name__ == "__main__":
    client = MongoClient("mongodb://localhost:27017/")
    db = client["emotion_app"]
    seed_messages(db)
    client.close()
