import React from "react";

function Results({ result, onBackToLobby }) {
    return (
        <div className="card">
            <h2>Resultados</h2>
            <p>{result.message}</p>
            <button onClick={onBackToLobby}>Volver al Lobby</button>
        </div>
    );
}

export default Results;