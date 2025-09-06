import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        // 🚨 Si no hay token, redirigir al login
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;