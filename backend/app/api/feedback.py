from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app import models

router = APIRouter()

class FeedbackRequest(BaseModel):
    patient_id: int
    therapist_id: int
    rating: int
    feedback_text: str | None = ""

@router.post("/")
def submit_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    fb = models.Feedback(
        patient_id=req.patient_id,
        therapist_id=req.therapist_id,
        rating=req.rating,
        feedback_text=req.feedback_text
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return {"feedback_id": fb.id, "message": "Feedback submitted successfully"}
