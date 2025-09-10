import React, { useEffect, useState } from "react";

export default function SupervisorDashboard() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/plan/review") // Optional: GET all pending plans endpoint
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  async function handleReview(plan_id, action) {
    const res = await fetch("http://127.0.0.1:8000/plan/review", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ plan_id, action })
    });
    const data = await res.json();
    alert(`Plan ${data.status}`);
  }

  return (
    <div>
      <h2>Supervisor Dashboard</h2>
      {plans.map(p => (
        <div key={p.id}>
          <p>Plan: {p.details}</p>
          <button onClick={() => handleReview(p.id, "approve")}>Approve</button>
          <button onClick={() => handleReview(p.id, "reject")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
