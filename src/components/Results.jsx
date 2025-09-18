import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const winner = state?.winner;

    return (
        <div className="card">
            <h2>Resultados</h2>
            {winner ? (
                <p>Ganador: {winner.name} 🎉</p>
            ) : (
                <p>No hubo ganador</p>
            )}
            <button onClick={() => navigate("/lobby")}>Volver al Lobby</button>
        </div>
    );
}

export default Results;
