import React, { useState } from "react";
import API from "../services/api";

export default function RegisterForm({ onRegister }) {
    const [form, setForm] = useState({ username: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/auth/register", form);
        onRegister();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nombre"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input type="email" placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit">Registrarse</button>
        </form>
    );
}