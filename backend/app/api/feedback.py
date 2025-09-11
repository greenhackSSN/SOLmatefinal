from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models

router = APIRouter(tags=["feedback"])

class FeedbackCreate(BaseModel):
    patient_id: int
    therapist_id: int
    rating: int
    feedback_text: str

@router.post("/feedback")
def create_feedback(req: FeedbackCreate, db: Session = Depends(get_db)):
    feedback = models.Feedback(
        patient_id=req.patient_id,
        therapist_id=req.therapist_id,
        rating=req.rating,
        feedback_text=req.feedback_text
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return {"feedback_id": feedback.id}