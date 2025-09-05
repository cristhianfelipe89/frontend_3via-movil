import React, { useEffect, useState } from "react";
import socket from "../services/socket";

export default function Game({ onFinish }) {
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        socket.on("gameStarted", (data) => setQuestion(data.question));
        socket.on("newQuestion", (q) => setQuestion(q));
        socket.on("gameOver", (winner) => onFinish(winner));

        return () => {
            socket.off("gameStarted");
            socket.off("newQuestion");
            socket.off("gameOver");
        };
    }, [onFinish]);

    const sendAnswer = (opt) => {
        socket.emit("answer", { answer: opt });
    };

    return (
        <div>
            {question ? (
                <>
                    <h3>{question.question}</h3>
                    {question.options.map((opt, i) => (
                        <button key={i} onClick={() => sendAnswer(opt)}>{opt}</button>
                    ))}
                </>
            ) : <p>Esperando inicio...</p>}
        </div>
    );
}