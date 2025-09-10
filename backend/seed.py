from app.db import SessionLocal, engine
from app import models

# Create all tables if not exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()
t = models.Therapist(
    name="TherapistA",
    specialization="speech_delay,stutter,apraxia",
    languages="english,tamil,hindi",
    workload_capacity=5
)
t2 = models.Therapist(
    name="Dr. Priya Nair",
    specialization="speech_delay,stutter",
    languages="english,tamil",
    workload_capacity=5
)
t3 = models.Therapist(
    name="Dr. Kavita Singh",
    specialization="apraxia,stutter",
    languages="english,hindi",
    workload_capacity=5
)
db.add_all([t2,t3])
db.commit()

db.add(t)
db.commit()
db.close()
print("Seeded initial therapist successfully.")
