import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Form.css";

function RegisterForm() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { name, username, email, password });
            alert("Registro exitoso ✅ Ahora inicia sesión");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Error al registrarse");
        }
    };

    return (
        <div className="form-container">
            <img src="/logo.svg" alt="Logo" className="logo" />
            <h2>Registro</h2>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registrarse</button>
            </form>

            {/* 🔹 Pregunta y enlace en dos líneas */}
            <div className="form-footer">
                <p>¿Ya tienes una cuenta?</p>
                <Link to="/" className="form-link">Inicia sesión</Link>
            </div>
        </div>
    );
}

export default RegisterForm;