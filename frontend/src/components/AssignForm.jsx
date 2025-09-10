import React, { useState } from "react";

export default function AssignForm() {
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
  }

  return (
    <div>
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
          <h3>Assigned</h3>
          <p>Therapist: {result.therapist}</p>
          <p>Plan: {result.plan}</p>
        </div>
      )}
    </div>
  );
}
