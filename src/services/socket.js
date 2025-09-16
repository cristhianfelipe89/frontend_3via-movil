// src/services/socket.js
import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

let singleton;
let lastToken;
function createSocket() {
    const token = localStorage.getItem("token") || undefined;
    const needsNew = !singleton || !singleton.connected || lastToken !== token;
    if (needsNew) {
        try { singleton?.disconnect(); } catch {}
        singleton = io(WS_URL, {
            transports: ["websocket"],
            auth: { token },
            autoConnect: true,
        });
        lastToken = token;
    }
    return singleton;
}

export default createSocket;