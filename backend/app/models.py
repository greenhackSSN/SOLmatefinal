from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from .db import Base

class Therapist(Base):
    __tablename__ = "therapists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)
    languages = Column(String)
    workload_capacity = Column(Integer, default=5)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    condition = Column(String)
    language = Column(String)
    workload = Column(Integer)
    therapist_id = Column(Integer, ForeignKey("therapists.id"), nullable=True)

class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    therapist_id = Column(Integer, ForeignKey("therapists.id"))
    details = Column(Text)
    status = Column(String, default="draft")
    supervisor_comments = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SessionLog(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    therapist_id = Column(Integer, ForeignKey("therapists.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    attendance = Column(String)
    notes = Column(Text)
    activities = Column(Text)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    therapist_id = Column(Integer, ForeignKey("therapists.id"))
    rating = Column(Integer)
    feedback_text = Column(Text)
