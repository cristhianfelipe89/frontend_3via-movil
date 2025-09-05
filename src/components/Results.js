import React from "react";

export default function Results({ winner, onBack }) {
    return (
        <div>
            <h2>Juego terminado</h2>
            <p>Ganador: {winner?.username}</p>
            <button onClick={onBack}>Volver</button>
        </div>
    );
}