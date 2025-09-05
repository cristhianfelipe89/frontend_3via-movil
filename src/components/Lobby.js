import React, { useEffect, useState } from "react";
import socket from "../services/socket";

export default function Lobby({ onStart }) {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.emit("joinLobby");
        socket.on("lobbyUpdate", (data) => setPlayers(data.players));
        socket.on("gameStarted", () => onStart());

        return () => {
            socket.off("lobbyUpdate");
            socket.off("gameStarted");
        };
    }, [onStart]);

    return (
        <div>
            <h2>Lobby</h2>
            <p>Jugadores conectados: {players.length}/5</p>
            <ul>
                {players.map((p, i) => <li key={i}>{p.username}</li>)}
            </ul>
        </div>
    );
}