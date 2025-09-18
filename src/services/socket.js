import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

let singleton = null;
let lastToken = null;

export function createSocket() {
    const token = localStorage.getItem("token");

    // 🚫 si no hay token, no conectamos
    if (!token) {
        console.warn("[Socket] No hay token, no se conecta.");
        return null;
    }

    const needsNew = !singleton || !singleton.connected || lastToken !== token;
    if (needsNew) {
        try {
            singleton?.disconnect();
        } catch (err) {
            console.warn("[Socket] error al desconectar socket previo:", err);
        }

        singleton = io(WS_URL, {
            auth: { token },
            autoConnect: true,
            transports: ["websocket", "polling"], // 👈 fallback
        });

        singleton.on("connect", () => {
            console.log("[Socket] conectado con id:", singleton.id);
        });

        singleton.on("connect_error", (err) => {
            console.error("[Socket] error de conexión:", err.message);

            if (err.message === "Invalid token" || err.message === "No token") {
                console.warn("[Socket] Token inválido o expirado, redirigiendo al lobby...");
                localStorage.removeItem("token");
                window.location.href = "/lobby";
            }
        });

        singleton.on("disconnect", (reason) => {
            console.warn("[Socket] desconectado:", reason);
        });

        lastToken = token;
    }

    return singleton;
}

export function disconnectSocket() {
    if (singleton) {
        singleton.disconnect();
        singleton = null;
        lastToken = null;
    }
}

export default createSocket;


