from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models

router = APIRouter(tags=["sessions"])

class SessionLogCreate(BaseModel):
    patient_id: int
    therapist_id: int
    attendance: str
    notes: str
    activities: str

@router.post("/session/log")
def log_session(req: SessionLogCreate, db: Session = Depends(get_db)):
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