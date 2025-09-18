// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Lobby from "./components/Lobby.jsx";
import Game from "./components/Game.jsx";
import Results from "./components/Results.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { disconnectSocket } from "./services/socket";

function App() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const handleLogin = (loggedUser) => {
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        if (loggedUser.token) {
            localStorage.setItem("token", loggedUser.token);
        }
    };

    const handleLogout = () => {
        disconnectSocket(); // 🔌 cerrar el socket al cerrar sesión
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <Router>
            <div className="container">
                <Routes>
                    {/* Público */}
                    <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protegidas */}
                    <Route
                        path="/lobby"
                        element={
                            <ProtectedRoute user={user}>
                                <Lobby user={user} onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/game"
                        element={
                            <ProtectedRoute user={user}>
                                <Game />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/results"
                        element={
                            <ProtectedRoute user={user}>
                                <Results />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirección según sesión */}
                    <Route
                        path="*"
                        element={<Navigate to={user ? "/lobby" : "/"} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
