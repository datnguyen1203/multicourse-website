import api from "./api";

export const authService = {

    register: async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
            return { success: false, message };
        }
    }
}