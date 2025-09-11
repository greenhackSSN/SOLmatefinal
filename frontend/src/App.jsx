// frontend/src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SupervisorDashboard from "./components/SupervisorDashboard";
import TherapistDashboard from "./components/TherapistDashboard";
import PatientDashboard from "./components/PatientDashboard";
import AssignForm from "./components/AssignForm";

export default function App() {
    const [userRole, setUserRole] = useState(null);
    const [assignedPatient, setAssignedPatient] = useState(null);

    const handleLogin = (role) => {
        setUserRole(role);
    };

    const handleLogout = () => {
        setUserRole(null);
        setAssignedPatient(null);
    };

    const renderDashboard = () => {
        switch (userRole) {
            case "supervisor":
                return <SupervisorDashboard onLogout={handleLogout} />;
            case "therapist":
                return <TherapistDashboard onLogout={handleLogout} />;
            case "patient":
                return <PatientDashboard onLogout={handleLogout} />;
            default:
                return <Navigate to="/" />;
        }
    };

    return (
        <Router>
            <div className="p-5 space-y-10">
                <h1 className="text-3xl font-bold">Solmate</h1>
                
                <Routes>
                    <Route path="/" element={userRole ? renderDashboard() : <LoginPage onLogin={handleLogin} />} />
                    
                    {/* These routes will render the specific dashboards after login */}
                    <Route path="/supervisor" element={userRole === "supervisor" ? <SupervisorDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/therapist" element={userRole === "therapist" ? <TherapistDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/patient" element={userRole === "patient" ? <PatientDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
                </Routes>

            </div>
        </Router>
    );
}
