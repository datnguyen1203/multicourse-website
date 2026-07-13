"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Đăng nhập thành công!");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center bg-slate-50 px-4 py-12">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                        Chào mừng quay trở lại
                    </CardTitle>
                    <CardDescription>
                        Đăng nhập tài khoản MultiCourse của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                                <Link href="/forgot-password" className="text-xs text-orange-500 hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 mt-2" disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t py-4 bg-slate-50/50 rounded-b-lg">
                    <p className="text-sm text-gray-600">
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="font-semibold text-orange-500 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}