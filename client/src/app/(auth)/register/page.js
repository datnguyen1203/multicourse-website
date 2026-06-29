"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        role: "student",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData((prev) => ({ ...prev, role: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullname, email, password, phone, role } = formData;

        // Validate cơ bản ở Frontend
        if (!fullname || !email || !password || !confirmPassword || !phone || !role) {
            toast.error("Vui lòng điền đầy đủ tất cả các trường dữ liệu!");
            return;
        }

        if (password.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu nhập lại không khớp!");
            return;
        }

        setIsSubmitting(true);
        const result = await authService.register(formData);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Đăng ký tài khoản thành công!", {
                description: "Hệ thống đang chuyển bạn sang trang đăng nhập.",
            });
            // Chuyển hướng sang trang đăng nhập sau 2 giây để người dùng kịp đọc thông báo
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center bg-slate-50 px-4 py-12">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                        Tạo tài khoản mới
                    </CardTitle>
                    <CardDescription>
                        Tham gia cộng đồng học tập trực tuyến MultiCourse
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* fullname */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Fullname
                            </label>
                            <Input
                                type="text"
                                name="fullname"
                                placeholder="Nguyen Van A..."
                                value={formData.fullname}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="student@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Phone number */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Phone number
                            </label>
                            <Input
                                type="text"
                                name="phone"
                                placeholder="03XXXXXXXX"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Type your password..."
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* re-password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Re-Password
                            </label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-type your password..."
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* role */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Bạn tham gia với vai trò
                            </label>
                            <Select
                                onValueChange={handleRoleChange}
                                defaultValue={formData.role}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Học viên (Student)</SelectItem>
                                    <SelectItem value="teacher">Giảng viên (Teacher)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* submit button */}
                        <Button type="submit" disabled={isSubmitting}
                            className="w-full bg-green-600 hover:bg-green-700 mt-2">
                            {isSubmitting ? "Đang xử lý tạo tài khoản..." : "Đăng ký ngay"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t py-4 bg-slate-50/50 rounded-b-lg">
                    <p className="text-sm text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="font-semibold text-green-600 hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}