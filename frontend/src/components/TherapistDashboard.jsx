// frontend/src/components/TherapistDashboard.jsx

import React, { useState, useEffect } from "react";
import SessionLogger from "./SessionLogger";

export default function TherapistDashboard({ onLogout }) {
  const [patients, setPatients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ patient_id: 0, details: "" });
  const [result, setResult] = useState(null);

  // NOTE: For this demo, we are using a hardcoded therapist ID.
  const therapistId = 1; 

  useEffect(() => {
    fetchTherapistData();
  }, []);

  const fetchTherapistData = async () => {
    try {
      // Fetch patients assigned to this therapist
      const patientsRes = await fetch(`http://127.0.0.1:8000/therapists/${therapistId}/patients`);
      const patientsData = await patientsRes.json();
      if (Array.isArray(patientsData)) {
        setPatients(patientsData);
      } else {
        console.error("API did not return an array for therapist patients:", patientsData);
        setPatients([]);
      }

      // Fetch plans created by this therapist
      const plansRes = await fetch(`http://127.0.0.1:8000/therapists/${therapistId}/plans`);
      const plansData = await plansRes.json();
      if (Array.isArray(plansData)) {
        setPlans(plansData);
      } else {
        console.error("API did not return an array for therapist plans:", plansData);
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch therapist data:", error);
      setPatients([]);
      setPlans([]);
    }
  };

  async function createPlan(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/plan/create", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ ...form, therapist_id: therapistId })
    });
    const data = await res.json();
    setResult(data);
    fetchTherapistData(); // Refresh data after creating a plan
  }

  return (
    <div className="p-5 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Therapist Dashboard (ID: {therapistId})</h2>
        <button onClick={onLogout} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            Log Out
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Assigned Patients</h3>
        <ul className="space-y-4">
          {Array.isArray(patients) && patients.map(patient => (
            <li key={patient.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Patient ID:</strong> {patient.id}</p>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Condition:</strong> {patient.condition}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Plans</h3>
        <ul className="space-y-4">
          {Array.isArray(plans) && plans.map(plan => (
            <li key={plan.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Plan ID:</strong> {plan.id}</p>
              <p><strong>Status:</strong> {plan.status}</p>
              <p><strong>Details:</strong> {plan.details}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create/Update Plan</h3>
        <form onSubmit={createPlan} className="space-y-4">
          <input type="number" placeholder="Patient ID" value={form.patient_id} onChange={e=>setForm({...form,patient_id:parseInt(e.target.value)})} className="w-full p-2 border rounded" />
          <textarea placeholder="Plan Details" value={form.details} onChange={e=>setForm({...form,details:e.target.value})} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Plan
          </button>
        </form>
        {result && <pre className="mt-4 p-4 bg-gray-100 rounded-lg">{JSON.stringify(result,null,2)}</pre>}
      </div>
      
      <div className="p-4 border border-gray-300 rounded-lg">
        <SessionLogger />
      </div>
    </div>
  );
}