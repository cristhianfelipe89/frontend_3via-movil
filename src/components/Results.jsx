import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const winnerId = state?.winner;

    
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const winnerName =
        currentUser && currentUser.id === winnerId
            ? currentUser.name
            : winnerId;

    return (
        <div className="card">
            <h2>Resultados</h2>
            <p>Ganador: {winnerName || "Desconocido"}</p>
            <button onClick={() => navigate("/lobby")}>Volver al Lobby</button>
        </div>
    );
}

export default Results;
