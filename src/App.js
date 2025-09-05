import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import Results from "./components/Results";

export default function App() {
    const [view, setView] = useState("login");
    const [winner, setWinner] = useState(null);

    if (view === "login") return <LoginForm onLogin={() => setView("lobby")} />;
    if (view === "register") return <RegisterForm onRegister={() => setView("login")} />;
    if (view === "lobby") return <Lobby onStart={() => setView("game")} />;
    if (view === "game") return <Game onFinish={(w) => { setWinner(w); setView("results"); }} />;
    if (view === "results") return <Results winner={winner} onBack={() => setView("login")} />;

    return null;
}