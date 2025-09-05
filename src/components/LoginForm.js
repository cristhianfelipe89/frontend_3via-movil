import React, { useState } from "react";
import API from "../services/api";

export default function LoginForm({ onLogin }) {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await API.post("/auth/login", form);
        localStorage.setItem("token", res.data.token);
        onLogin();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit">Entrar</button>
        </form>
    );
}