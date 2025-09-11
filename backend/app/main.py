# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .db import get_db, engine
from . import models, ml_wrapper
from .api import plans, sessions, feedback

# Create DB tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Therapy Case Allocation API")

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Request Schemas
class AssignRequest(BaseModel):
    name: str | None = None
    condition: str
    language: str
    workload: int

# Main endpoint to assign a patient (ML integration)
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

# Include API routers from other files
app.include_router(plans.router)
app.include_router(sessions.router)
app.include_router(feedback.router)