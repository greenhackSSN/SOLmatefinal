import pandas as pd
import os

# --------------------------
# Paths
# --------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "therapy_data.csv")

# --------------------------
# Load CSV and clean data
# --------------------------
plans_df = pd.read_csv(CSV_PATH)

# Remove leading/trailing spaces from columns
plans_df['condition'] = plans_df['condition'].str.strip()
plans_df['plan'] = plans_df['plan'].str.strip()

# Create a dictionary mapping condition -> plan
THERAPY_PLANS = dict(zip(plans_df['condition'].str.lower(), plans_df['plan']))

# --------------------------
# Function to suggest plan
# --------------------------
def suggest_plan(condition):
    """
    Returns therapy plan for a given condition.
    If condition not found, returns a default general plan.
    """
    condition_lower = condition.lower().strip()
    plan = THERAPY_PLANS.get(condition_lower, "General speech therapy plan")
    return {"plan": plan}

# --------------------------
# Function for frontend/backend API
# --------------------------
def process_plan(condition):
    """
    Wrapper function for frontend/backend use.
    """
    return suggest_plan(condition)

# --------------------------
# Quick test
# --------------------------
if __name__ == "__main__":
    test_conditions = ["stutter", "apraxia", "new_condition"]
    for cond in test_conditions:
        print(f"{cond} -> {process_plan(cond)}")
