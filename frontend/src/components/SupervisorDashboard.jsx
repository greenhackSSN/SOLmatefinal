// frontend/src/components/SupervisorDashboard.jsx

import React, { useState, useEffect } from "react";
import AssignForm from "./AssignForm";

export default function SupervisorDashboard({ onLogout }) {
  const [plans, setPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [planId, setPlanId] = useState("");
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("approved");
  const [reviewResult, setReviewResult] = useState(null);

  // Fetch all patients and plans on component load
  useEffect(() => {
    fetchPatients();
    fetchPlans();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/patients");
      const data = await res.json();
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error("API did not return an array for patients:", data);
        setPatients([]);
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatients([]);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/plans");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        console.error("API did not return an array for plans:", data);
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    }
  };

  async function reviewPlan(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/plan/review", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ plan_id: parseInt(planId), supervisor_comments: comments, status })
    });
    const data = await res.json();
    setReviewResult(data);
    fetchPlans(); // Refresh the list after reviewing
  }

  return (
    <div className="p-5 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Supervisor Dashboard</h2>
        <button onClick={onLogout} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            Log Out
        </button>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg">
        <AssignForm />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Pending Plans for Review</h3>
        <ul className="space-y-4">
          {Array.isArray(plans) && plans.filter(p => p.status === 'pending_review').map(plan => (
            <li key={plan.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Plan ID:</strong> {plan.id}</p>
              <p><strong>Patient ID:</strong> {plan.patient_id}</p>
              <p><strong>Therapist ID:</strong> {plan.therapist_id}</p>
              <p><strong>Details:</strong> {plan.details}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Review Plan</h3>
        <form onSubmit={reviewPlan} className="space-y-4">
          <input type="number" placeholder="Plan ID" value={planId} onChange={e=>setPlanId(e.target.value)} className="w-full p-2 border rounded" />
          <textarea placeholder="Comments" value={comments} onChange={e=>setComments(e.target.value)} className="w-full p-2 border rounded" />
          <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full p-2 border rounded">
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit Review
          </button>
        </form>
        {reviewResult && <pre className="mt-4 p-4 bg-gray-100 rounded-lg">{JSON.stringify(reviewResult,null,2)}</pre>}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">All Patients and Assignments</h3>
        <ul className="space-y-4">
          {Array.isArray(patients) && patients.map(patient => (
            <li key={patient.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Patient ID:</strong> {patient.id}</p>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Condition:</strong> {patient.condition}</p>
              <p><strong>Therapist ID:</strong> {patient.therapist_id || "Not Assigned"}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
