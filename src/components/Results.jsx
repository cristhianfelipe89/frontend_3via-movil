import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const winner = state?.winner;

    return (
        <div className="card">
            <h2>Resultados</h2>
            <p>Ganador: {winner || "Desconocido"}</p>
            <button onClick={() => navigate("/lobby")}>Volver al Lobby</button>
        </div>
    );
}

export default Results;