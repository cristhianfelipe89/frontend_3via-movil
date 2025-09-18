import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createSocket, { disconnectSocket } from "../services/socket";

function Game() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const initialGameId = state?.gameId;
    const [gameId, setGameId] = useState(initialGameId || null);

    const [question, setQuestion] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [finished, setFinished] = useState(false);
    const [winner, setWinner] = useState(null);
    const [lost, setLost] = useState(false); // estado nuevo

    const optionColors = ["#2e7d32", "#1565c0", "#6a1b9a", "#ef6c00"];

    useEffect(() => {
        const socket = createSocket();
        if (!socket.connected) socket.connect();

        socket.on("game:start", ({ gameId: gid }) => {
            setGameId(gid);
        });

        socket.on("game:question", (q) => {
            setQuestion(q);
            setSelectedIndex(null);
            setIsSubmitting(false);
        });

        socket.on("game:error", ({ message }) => {
            navigate("/lobby");
        });

        socket.on("game:finished", ({ winner }) => {
            setWinner(winner);
            setFinished(true);
        });

        // cuando pierdes
        socket.on("game:lost", () => {
            setLost(true);
        });

        return () => {
            socket.off("game:start");
            socket.off("game:question");
            socket.off("game:error");
            socket.off("game:finished");
            socket.off("game:lost");
        };
    }, [navigate]);

    const handleAnswer = (optionIndex) => {
        const socket = createSocket();
        if (!socket.connected) socket.connect();
        if (!question || !gameId || isSubmitting) return;
        setSelectedIndex(optionIndex);
        setIsSubmitting(true);
        socket.emit("game:answer", {
            gameId,
            questionId: question.id,
            optionIndex,
            tsClient: Date.now(),
        });
    };

    // Vista de cuando pierdes
    if (lost) {
    return (
        <div className="card">
            <h2>Perdiste 😢</h2>
            <p>¡Vuelve a intentarlo en otra partida!</p>
            <button
                onClick={() => {
                    disconnectSocket();   // 🔴 corta conexión del juego actual
                    setQuestion(null);    // limpia preguntas
                    setWinner(null);      // limpia ganador
                    setFinished(false);   // limpia estado
                    setLost(false);       // limpia perdido
                    navigate("/lobby");   // ✅ redirige al lobby real
                }}
                style={{
                    marginTop: 20,
                    padding: "12px 18px",
                    border: "none",
                    background: "#d32f2f",
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 18,
                    cursor: "pointer",
                }}
            >
                Regresar al Lobby
            </button>
        </div>
    );
}

    // Vista cuando termina el juego
    if (finished) {
    return (
        <div className="card">
            <h2>¡Juego terminado!</h2>
            {winner ? (
                <p>Ganador: {winner.name}</p>
            ) : (
                <p>Hubo un empate</p>
            )}
            <button
                onClick={() => {
                    disconnectSocket();   // 🔴 corta socket
                    setQuestion(null);
                    setWinner(null);
                    setFinished(false);
                    setLost(false);
                    navigate("/lobby");   // ✅ siempre vuelve limpio al lobby
                }}
                style={{
                    marginTop: 20,
                    padding: "12px 18px",
                    border: "none",
                    background: "#1565c0",
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 18,
                    cursor: "pointer",
                }}
            >
                Regresar al Lobby
            </button>
        </div>
    );
}

    // Vista cuando no hay pregunta
    if (!question) {
        return (
            <div className="card">
                <p>Esperando pregunta...</p>
            </div>
        );
    }

    // Vista de preguntas
    return (
        <div className="card">
            <h2>{question.statement}</h2>
            <div>
                {question.options.map((opt, i) => {
                    const bg = optionColors[i % optionColors.length];
                    const isChosen = selectedIndex === i;
                    return (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={isSubmitting}
                            style={{
                                marginBottom: 12,
                                backgroundColor: isChosen ? "#00c853" : bg,
                                border: "none",
                                color: "#fff",
                                padding: "14px 12px",
                                width: "100%",
                                borderRadius: 8,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                fontSize: 18,
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Game;
