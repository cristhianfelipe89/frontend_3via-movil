import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createSocket from "../services/socket";

function Game() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const initialGameId = state?.gameId;
    const [gameId, setGameId] = useState(initialGameId || null);

    const [question, setQuestion] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [roundSummary, setRoundSummary] = useState(null);

    // Colores de opciones
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
            setRoundSummary(null); // limpiar feedback de la ronda previa
        });

        socket.on("game:roundSummary", (summary) => {
            console.log("[RoundSummary]", summary);
            setRoundSummary(summary);
            setQuestion(null); // ocultar pregunta hasta que llegue la siguiente
            setSelectedIndex(null);
            setIsSubmitting(false);
        });

        socket.on("game:error", ({ message }) => {
            navigate("/lobby");
            alert(message || "Error de juego");
        });

        socket.on("game:finished", ({ winner }) => {
            navigate("/results", { state: { winner } });
        });

        return () => {
            socket.off("game:start");
            socket.off("game:question");
            socket.off("game:roundSummary");
            socket.off("game:finished");
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

    // Mostrar feedback de la ronda
    if (roundSummary && !question) {
        return (
            <div className="card">
                <h2>Resumen de la ronda</h2>
                <p>
                    Respuesta correcta:{" "}
                    <strong>{roundSummary.correctIndex + 1}</strong>
                </p>
                <p>Eliminados: {roundSummary.eliminated?.length || 0}</p>
                <p>Jugadores vivos: {roundSummary.aliveCount}</p>
                <p>⏳ Esperando la siguiente pregunta...</p>
            </div>
        );
    }

    // Si no hay pregunta ni resumen todavía
    if (!question) {
        return (
            <div className="card">
                <p>Esperando pregunta...</p>
            </div>
        );
    }

    // Render de la pregunta
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
