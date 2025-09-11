// frontend/src/components/PatientDashboard.jsx

import React, { useState, useEffect } from "react";

export default function PatientDashboard({ onLogout }) {
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientPlans, setPatientPlans] = useState([]);
  const [patientFeedback, setPatientFeedback] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, feedback_text: "" });
  const [result, setResult] = useState(null);

  // NOTE: For this demo, we are using a hardcoded patient ID.
  const patientId = 1;

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      // Fetch patient details
      const detailsRes = await fetch(`http://127.0.0.1:8000/patients/${patientId}/details`);
      const detailsData = await detailsRes.json();
      setPatientDetails(detailsData);
      
      // Fetch patient's plans
      const plansRes = await fetch(`http://127.0.0.1:8000/patients/${patientId}/plans`);
      const plansData = await plansRes.json();
      if (Array.isArray(plansData)) {
        setPatientPlans(plansData);
      } else {
        console.error("API did not return an array for patient plans:", plansData);
        setPatientPlans([]);
      }

      // Fetch patient's feedback
      const feedbackRes = await fetch(`http://127.0.0.1:8000/patients/${patientId}/feedback`);
      const feedbackData = await feedbackRes.json();
      if (Array.isArray(feedbackData)) {
        setPatientFeedback(feedbackData);
      } else {
        console.error("API did not return an array for patient feedback:", feedbackData);
        setPatientFeedback([]);
      }

    } catch (error) {
      console.error("Failed to fetch patient data:", error);
      setPatientDetails(null);
      setPatientPlans([]);
      setPatientFeedback([]);
    }
  };

  async function submitFeedback(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/feedback", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ ...feedbackForm, patient_id: patientId, therapist_id: patientDetails.therapist_id })
    });
    const data = await res.json();
    setResult(data);
    fetchPatientData(); // Refresh data after submitting
  }

  if (!patientDetails) {
    return <div className="p-5 text-center text-gray-500">Loading patient data...</div>;
  }

  return (
    <div className="p-5 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patient Dashboard (ID: {patientId})</h2>
        <button onClick={onLogout} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            Log Out
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Details</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p><strong>Name:</strong> {patientDetails.name}</p>
          <p><strong>Assigned Therapist ID:</strong> {patientDetails.therapist_id}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Therapy Plan(s)</h3>
        <ul className="space-y-4">
          {Array.isArray(patientPlans) && patientPlans.map(plan => (
            <li key={plan.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Plan ID:</strong> {plan.id}</p>
              <p><strong>Status:</strong> {plan.status}</p>
              <p><strong>Details:</strong> {plan.details}</p>
              {plan.supervisor_comments && <p><strong>Supervisor Comments:</strong> {plan.supervisor_comments}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Submit Feedback</h3>
        <form onSubmit={submitFeedback} className="space-y-4">
          <input type="number" min={1} max={5} placeholder="Rating (1-5)" value={feedbackForm.rating} onChange={e=>setFeedbackForm({...feedbackForm,rating:parseInt(e.target.value)})} className="w-full p-2 border rounded" />
          <textarea placeholder="Feedback notes" value={feedbackForm.feedback_text} onChange={e=>setFeedbackForm({...feedbackForm,feedback_text:e.target.value})} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit Feedback
          </button>
        </form>
        {result && <pre className="mt-4 p-4 bg-gray-100 rounded-lg">{JSON.stringify(result, null, 2)}</pre>}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Past Feedback</h3>
        <ul className="space-y-4">
          {Array.isArray(patientFeedback) && patientFeedback.map(f => (
            <li key={f.id} className="p-4 bg-gray-100 rounded-lg">
              <p><strong>Rating:</strong> {f.rating}</p>
              <p><strong>Notes:</strong> {f.feedback_text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}