// frontend/src/components/SessionLogger.jsx

import React, { useState, useEffect } from "react";

export default function SessionLogger({ assignedPatient }) {
  const [session, setSession] = useState({ patient_id: 0, therapist_id: 0, attendance: "present", notes: "", activities: "" });
  const [result, setResult] = useState(null);

  // This hook updates the form when a patient is assigned
  useEffect(() => {
    if (assignedPatient) {
      setSession({
        patient_id: assignedPatient.patient_id,
        therapist_id: 1, // Placeholder for the therapist ID
        attendance: "present",
        notes: "",
        activities: ""
      });
    }
  }, [assignedPatient]);

  async function logSession(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/session/log", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(session)
    });
    const data = await res.json();
    setResult(data);
  }

  return (
    <div>
      <h2>4. Log a Session (Therapist)</h2>
      <form onSubmit={logSession}>
        <input type="number" placeholder="Patient ID" value={session.patient_id} onChange={e=>setSession({...session,patient_id:parseInt(e.target.value)})} />
        <input type="number" placeholder="Therapist ID" value={session.therapist_id} onChange={e=>setSession({...session,therapist_id:parseInt(e.target.value)})} />
        <select value={session.attendance} onChange={e=>setSession({...session,attendance:e.target.value})}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <textarea placeholder="Session Notes" value={session.notes} onChange={e=>setSession({...session,notes:e.target.value})} />
        <textarea placeholder="Activities Done" value={session.activities} onChange={e=>setSession({...session,activities:e.target.value})} />
        <button type="submit">Log Session</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}