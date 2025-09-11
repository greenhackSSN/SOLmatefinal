// frontend/src/components/AssignForm.jsx

import React, { useState } from "react";

// Make sure to accept the prop in the function signature
export default function AssignForm({ onAssignSuccess }) {
  const [form, setForm] = useState({ name: "", condition: "speech_delay", language: "english", workload: 2});
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/patients/assign", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);

    // This is the correct placement. It should be inside the function.
    if (onAssignSuccess) {
      onAssignSuccess(data);
    }
  }

  return (
    <div>
      <h2>1. Assign Patient (Supervisor)</h2>
      <form onSubmit={submit}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Patient name (optional)" />
        <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}>
          <option value="speech_delay">speech_delay</option>
          <option value="stutter">stutter</option>
          <option value="apraxia">apraxia</option>
        </select>
        <select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>
          <option value="english">english</option>
          <option value="tamil">tamil</option>
          <option value="hindi">hindi</option>
        </select>
        <input type="number" min={1} max={3} value={form.workload} onChange={e=>setForm({...form,workload:parseInt(e.target.value)})}/>
        <button type="submit">Assign</button>
      </form>

      {result && (
        <div>
          <h3>Assignment Result</h3>
          <p>Patient ID: {result.patient_id}</p>
          <p>Therapist: {result.therapist}</p>
          <p>Plan ID: {result.plan_id}</p>
          <p>Initial Plan: {result.plan}</p>
        </div>
      )}
    </div>
  );
}