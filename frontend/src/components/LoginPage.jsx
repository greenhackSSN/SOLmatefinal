// frontend/src/components/LoginPage.jsx

import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("therapist");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-semibold" htmlFor="role">Select Your Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="supervisor">Supervisor</option>
              <option value="therapist">Therapist</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
