import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

# --------------------------
# Base directory setup
# --------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Folder where this script is located
AI_DIR = os.path.join(BASE_DIR)  # optional, if you want to keep AI files in the same folder

DATA_PATH = os.path.join(AI_DIR, "matching_data.csv")
MODEL_PATH = os.path.join(AI_DIR, "match_model.pkl")

# Ensure folder exists
os.makedirs(AI_DIR, exist_ok=True)

# --------------------------
# Load dataset
# --------------------------
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"CSV file not found at {DATA_PATH}")

data = pd.read_csv(DATA_PATH)

# Features and target
X = data[["condition_encoded", "language_encoded", "workload"]]
y = data["therapist"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Save trained model
joblib.dump(model, MODEL_PATH)
print("✅ Therapist Matching Model trained and saved successfully!")

# --------------------------
# Functions for frontend / API
# --------------------------
def match_therapist(language, workload, condition="speech_delay"):
    """Predict the best therapist based on patient data"""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}")
    
    model = joblib.load(MODEL_PATH)

    # Encode language
    lang_map = {"english": 0, "tamil": 1, "hindi": 2}
    language_encoded = lang_map.get(language.lower(), 0)

    # Encode condition
    condition_map = {"speech_delay": 0, "stutter": 1, "apraxia": 2}
    condition_encoded = condition_map.get(condition.lower(), 0)

    X_new = [[condition_encoded, language_encoded, workload]]
    prediction = model.predict(X_new)
    return prediction[0]

def process_patient(condition, language, workload):
    """Return only the predicted therapist"""
    therapist = match_therapist(language, workload, condition)
    return {"therapist": therapist}

# --------------------------
# Optional test
# --------------------------
if __name__ == "__main__":
    print("✅ Therapist Matching Module ready. Import functions for frontend use.")
