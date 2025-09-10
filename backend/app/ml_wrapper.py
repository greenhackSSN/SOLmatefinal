try:
    from ai.ml_match_therapist import match_therapist
    from ai.ml_suggest_plan import process_plan
except:
    match_therapist = None
    process_plan = None

def process_patient(condition, language, workload):
    if match_therapist and process_plan:
        therapist = match_therapist(language, workload, condition)
        plan = process_plan(condition)['plan']
        return {"therapist": therapist, "plan": plan}
    # fallback for testing
    return {"therapist": "TherapistA", "plan": f"Basic plan for {condition}, {workload} sessions/week"}
