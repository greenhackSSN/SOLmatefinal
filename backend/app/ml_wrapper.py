from .ai.ml_match_therapist import match_therapist
from .ai.ml_suggest_plan import process_plan

def process_patient(condition: str, language: str, workload: int):
    therapist = match_therapist(language, workload, condition)
    plan = process_plan(condition)["plan"]
    return {
        "therapist": therapist,
        "plan": plan
    }
