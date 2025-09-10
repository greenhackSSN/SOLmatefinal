from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app import models

router = APIRouter()

class SessionLogRequest(BaseModel):
    patient_id: int
    therapist_id: int
    attendance: str
    notes: str | None = ""
    activities: str | None = ""

@router.post("/log")
def log_session(req: SessionLogRequest, db: Session = Depends(get_db)):
    session = models.SessionLog(
        patient_id=req.patient_id,
        therapist_id=req.therapist_id,
        attendance=req.attendance,
        notes=req.notes,
        activities=req.activities
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"session_id": session.id}
