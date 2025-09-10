import React from "react";

export default function PatientDashboard({ patient }) {
  return (
    <div>
      <h2>Patient Dashboard</h2>
      <p>Therapist: {patient.therapist}</p>
      <p>Plan: {patient.plan}</p>
    </div>
  );
}
