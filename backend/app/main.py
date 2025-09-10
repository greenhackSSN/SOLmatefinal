from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .db import get_db, engine
from . import models, ml_wrapper
from app.api import plans, sessions, feedback

app = FastAPI(title="Therapy Case Allocation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon/demo; you can restrict to ["http://localhost:3000"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(plans.router, prefix="/plan")
app.include_router(sessions.router, prefix="/session")
app.include_router(feedback.router, prefix="/feedback")

class AssignRequest(BaseModel):
    name: str | None = None
    condition: str
    language: str
    workload: int

@app.post("/patients/assign")
def assign_patient(req: AssignRequest, db: Session = Depends(get_db)):
    patient = models.Patient(name=req.name, condition=req.condition, language=req.language, workload=req.workload)
    db.add(patient)
    db.commit()
    db.refresh(patient)

    ml_out = ml_wrapper.process_patient(condition=req.condition, language=req.language, workload=req.workload)

    therapist_name = ml_out.get("therapist")
    therapist = db.query(models.Therapist).filter(models.Therapist.name==therapist_name).first()
    if not therapist:
        therapist = models.Therapist(name=therapist_name, specialization=req.condition, languages=req.language)
        db.add(therapist)
        db.commit()
        db.refresh(therapist)

    patient.therapist_id = therapist.id
    db.add(patient)
    db.commit()
    db.refresh(patient)

    plan = models.Plan(patient_id=patient.id, therapist_id=therapist.id, details=ml_out.get("plan",""), status="pending_review")
    db.add(plan)
    db.commit()
    db.refresh(plan)

    return {"patient_id": patient.id, "therapist": therapist.name, "plan_id": plan.id, "plan": plan.details}
