import axios from "axios";

const api = axios.create({
    //baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Cambiar según backend desplegado
    baseURL: import.meta.env.VITE_API_URL || "http://api.prouni.online/api", // Cambiar según backend desplegado
});

export default api;