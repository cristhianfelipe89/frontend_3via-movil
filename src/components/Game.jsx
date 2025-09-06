import React, { useEffect, useState } from "react";
import socket from "../services/socket";

function Game({ data, onFinish }) {
    const [question, setQuestion] = useState(data.question);
    const [options, setOptions] = useState(data.options);

    const handleAnswer = (answer) => {
        socket.emit("answer", { answer });
    };

    useEffect(() => {
        socket.on("nextQuestion", (q) => {
            setQuestion(q.question);
            setOptions(q.options);
        });

        socket.on("gameOver", (result) => {
            onFinish(result);
        });

        return () => {
            socket.off("nextQuestion");
            socket.off("gameOver");
        };
    }, [onFinish]);

    return (
        <div className="card">
            <h2>{question}</h2>
            <div>
                {options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(opt)}>{opt}</button>
                ))}
            </div>
        </div>
    );
}

export default Game;