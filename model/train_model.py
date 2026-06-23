"""
Training script for facial emotion detection using MobileNetV2 transfer learning.

Dataset: Balanced FER-2013 (75×75 images, organized in class subdirectories)
Expected structure:
    dataset/
        train/
            Angry/
            Disgust/
            Fear/
            Happy/
            Sad/
            Surprise/
            Neutral/
        test/
            Angry/
            ...

Output: model/model.h5
"""

import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import (
    Dense,
    Dropout,
    GlobalAveragePooling2D,
)
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

# ──────────────────────────────── Configuration ────────────────────────────────

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRAIN_DIR = os.path.join(BASE_DIR, "dataset", "train")
VAL_DIR = os.path.join(BASE_DIR, "dataset", "val")
TEST_DIR = os.path.join(BASE_DIR, "dataset", "test")
MODEL_SAVE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.h5")

# Model parameters
# Dataset images are 75×75; resize to 96×96 for better MobileNetV2 performance
IMG_SIZE = (96, 96)
BATCH_SIZE = 32
EPOCHS = 20
NUM_CLASSES = 7
LEARNING_RATE = 0.0001

# Emotion labels (alphabetical — matches directory order)
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]


def create_data_generators():
    """Create training and validation data generators with augmentation."""

    # Training data with augmentation
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=15,
        width_shift_range=0.15,
        height_shift_range=0.15,
        horizontal_flip=True,
        zoom_range=0.15,
        shear_range=0.1,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
    )

    # Validation data — only rescale
    val_datagen = ImageDataGenerator(rescale=1.0 / 255)

    # Test data — only rescale
    test_datagen = ImageDataGenerator(rescale=1.0 / 255)

    train_generator = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        class_mode="categorical",
        classes=EMOTIONS,
        shuffle=True,
    )

    val_generator = val_datagen.flow_from_directory(
        VAL_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        class_mode="categorical",
        classes=EMOTIONS,
        shuffle=False,
    )

    test_generator = test_datagen.flow_from_directory(
        TEST_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        class_mode="categorical",
        classes=EMOTIONS,
        shuffle=False,
    )

    return train_generator, val_generator, test_generator


def build_model():
    """
    Build emotion detection model using MobileNetV2 transfer learning.

    Architecture:
        MobileNetV2 (frozen base, ImageNet weights) →
        GlobalAveragePooling2D →
        Dense(128, relu) →
        Dropout(0.5) →
        Dense(7, softmax)
    """
    # Load MobileNetV2 without top classification layer
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3),
        include_top=False,
        weights="imagenet",
    )

    # Freeze the base model layers initially
    base_model.trainable = False

    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation="relu")(x)
    x = Dropout(0.5)(x)
    output = Dense(NUM_CLASSES, activation="softmax")(x)

    model = Model(inputs=base_model.input, outputs=output)

    # Compile
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    print("\n✅ Model built successfully!")
    model.summary()

    return model


def train():
    """Train the model and save the best weights."""

    print("📂 Creating data generators...")
    train_gen, val_gen, test_gen = create_data_generators()

    print(f"📊 Training samples: {train_gen.samples}")
    print(f"📊 Validation samples: {val_gen.samples}")
    print(f"📊 Test samples: {test_gen.samples}")
    print(f"📊 Classes: {train_gen.class_indices}")

    print("\n🏗️  Building model...")
    model = build_model()

    # Callbacks
    callbacks = [
        EarlyStopping(
            monitor="val_loss", patience=5, restore_best_weights=True, verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=3, min_lr=1e-7, verbose=1
        ),
        ModelCheckpoint(
            MODEL_SAVE_PATH, monitor="val_accuracy", save_best_only=True, verbose=1
        ),
    ]

    print("\n🚀 Starting training...")
    history = model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1,
    )

    # Evaluate on test set
    print("\n📈 Evaluating on test set...")
    test_loss, test_acc = model.evaluate(test_gen, verbose=0)
    print(f"   Test Loss: {test_loss:.4f}")
    print(f"   Test Accuracy: {test_acc:.4f}")

    print(f"\n💾 Model saved to: {MODEL_SAVE_PATH}")

    return history


if __name__ == "__main__":
    train()
