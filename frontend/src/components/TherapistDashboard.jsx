import React, { useEffect, useState } from "react";

export default function TherapistDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/patients/assign") // Replace with GET assigned patients endpoint
      .then(res => res.json())
      .then(data => setPatients(data));
  }, []);

  return (
    <div>
      <h2>Therapist Dashboard</h2>
      {patients.map(p => (
        <div key={p.id}>
          <p>Patient: {p.name}</p>
          <p>Plan: {p.plan}</p>
        </div>
      ))}
    </div>
  );
}
