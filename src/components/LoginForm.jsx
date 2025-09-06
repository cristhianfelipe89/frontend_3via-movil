import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Form.css";

function LoginForm({ onLogin }) {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { emailOrUsername, password });
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (onLogin) onLogin(user);
            navigate("/lobby");
        } catch (err) {
            alert(err.response?.data?.message || "Error en las credenciales");
        }
    };

    return (
        <div className="form-container">
            <img src="/logo.svg" alt="Logo" className="logo" />
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Correo o Usuario"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>

            {/* 🔹 Pregunta y enlace en dos líneas */}
            <div className="form-footer">
                <p>¿No tienes una cuenta?</p>
                <Link to="/register" className="form-link">Regístrate</Link>
            </div>
        </div>
    );
}

export default LoginForm;