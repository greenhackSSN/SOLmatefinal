from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app import models

router = APIRouter()

class PlanReviewRequest(BaseModel):
    plan_id: int
    action: str  # "approve" or "reject"
    supervisor_comments: str | None = None

@router.post("/review")
def review_plan(req: PlanReviewRequest, db: Session = Depends(get_db)):
    plan = db.query(models.Plan).filter(models.Plan.id == req.plan_id).first()
    if not plan:
        return {"error": "Plan not found"}
    plan.status = "approved" if req.action=="approve" else "rejected"
    if req.supervisor_comments:
        plan.supervisor_comments = req.supervisor_comments
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return {"plan_id": plan.id, "status": plan.status, "comments": plan.supervisor_comments}
