"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = Cookies.get("token");
        const savedUser = Cookies.get("user");

        if (!token || !savedUser) return null;

        try {
            return JSON.parse(savedUser);
        } catch {
            Cookies.remove("user");
            return null;
        }
    });
    const [loading] = useState(false);
    const router = useRouter();

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { success, token, role } = response.data;

            if (success && token) {
                // 1. Lưu token vào Cookie (hạn 3 ngày giống exp của JWT bạn cấu hình)
                Cookies.set("token", token, { expires: 3 });

                // 2. Vì JWT chứa thông tin user trong payload, ta giải mã cơ bản để lấy thông tin hiển thị UI
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const payload = JSON.parse(window.atob(base64));

                const userData = {
                    id: payload.user.id,
                    name: payload.user.fullname,
                    avatar: payload.user.avatar_url,
                    role: role,
                };

                // 3. Lưu thông tin user vào state và cookie
                setUser(userData);
                Cookies.set("user", JSON.stringify(userData), { expires: 3 });

                // 4. Điều hướng dựa trên Role
                if (role === "admin") router.push("/admin/dashboard");
                else if (role === "teacher") router.push("/teacher/dashboard");
                // else router.push("/student/dashboard");
                else router.push("/");

                return { success: true };
            }

            return {
                success: false,
                message: response.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!",
            };
        } catch (error) {
            const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
            return { success: false, message };
        }
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);