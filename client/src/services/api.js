import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "http://localhost:3000/api", // Base URL trỏ tới Backend của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

// Tự động đính kèm Token vào Header nếu có
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;