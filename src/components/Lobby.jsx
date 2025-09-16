import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import createSocket from "../services/socket";

function Lobby({ user, onStartGame }) {
    const [players, setPlayers] = useState([]);
    const [startingInMs, setStartingInMs] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const navigate = useNavigate();

    const currentUser = user || JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!currentUser) return;

        const socket = createSocket();
        if (!socket.connected) socket.connect();

        socket.emit("lobby:join");

        socket.on("lobby:update", (data) => {
            // data: { count, min, max }
            setPlayers(Array.from({ length: data.count }, (_, i) => ({ _id: i, name: `Jugador ${i+1}` })));
        });

        socket.on("game:start", ({ gameId }) => {
            if (onStartGame) onStartGame({ gameId });
            navigate("/game", { state: { gameId } });
        });

        // Salvaguarda: si por timing recibimos la pregunta antes de procesar game:start
        socket.on("game:question", () => {
            // Si aún no estamos en /game, navegar
            navigate("/game");
        });

        socket.on("lobby:starting", ({ inMs, at }) => {
            setStartingInMs(inMs);
            // Actualizar cuenta regresiva cada 200ms para suavidad
            const update = () => {
                const remaining = Math.max(0, at - Date.now());
                setCountdown(Math.ceil(remaining / 1000));
            };
            update();
            const id = setInterval(update, 200);
            // Limpiar cuando arranque juego o al desmontar
            socket.once("game:start", () => clearInterval(id));
            return () => clearInterval(id);
        });

        return () => {
            socket.off("lobby:update");
            socket.off("game:start");
            socket.off("lobby:starting");
            socket.off("game:question");
            // no desconectar el singleton; sólo limpiar eventos
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

            {typeof countdown === "number" && (
                <p>La partida inicia en {countdown}s</p>
            )}

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