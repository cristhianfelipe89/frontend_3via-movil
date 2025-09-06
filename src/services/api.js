import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // Cambiar según backend desplegado
});

export default api;