from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models

router = APIRouter(tags=["plans"])

class PlanCreate(BaseModel):
    patient_id: int
    therapist_id: int
    details: str

class PlanReview(BaseModel):
    plan_id: int
    supervisor_comments: str
    status: str  # approved/rejected

@router.post("/plan/create")
def create_plan(req: PlanCreate, db: Session = Depends(get_db)):
    plan = models.Plan(patient_id=req.patient_id, therapist_id=req.therapist_id, details=req.details, status="pending_review")
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return {"plan_id": plan.id, "status": plan.status}

@router.post("/plan/review")
def review_plan(req: PlanReview, db: Session = Depends(get_db)):
    plan = db.query(models.Plan).filter(models.Plan.id==req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan.status = req.status
    plan.supervisor_comments = req.supervisor_comments
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return {"plan_id": plan.id, "status": plan.status}