import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";

function Lobby({ user, onStartGame }) {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const currentUser = user || JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!currentUser) return;

        socket.emit("joinLobby", currentUser);

        socket.on("lobbyUpdate", (data) => {
            setPlayers(data.players);
        });

        socket.on("startGame", (gameData) => {
            onStartGame(gameData);
            navigate("/game"); // 👉 redirige al juego cuando inicia
        });

        return () => {
            socket.off("lobbyUpdate");
            socket.off("startGame");
        };
    }, [currentUser, onStartGame, navigate]);

    // 🔹 Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/"); // redirige al login
    };

    return (
        <div className="card">
            <h2>🎮 Lobby</h2>
            <p>Bienvenido {currentUser?.name || "Jugador"} 👋</p>
            <p>Esperando jugadores...</p>

            <ul>
                {players.map((p) => (
                    <li key={p._id}>{p.name}</li>
                ))}
            </ul>

            <button onClick={handleLogout} style={{ marginTop: "20px" }}>
                🚪 Cerrar sesión
            </button>
        </div>
    );
}

export default Lobby;