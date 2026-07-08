"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { BookOpen, DollarSign, Plus, Users } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const { user } = useAuth();
    // Giả lập dữ liệu thống kê từ API của Teacher
    const stats = [
        { title: "Tổng doanh thu", value: "15,400,000 đ", icon: DollarSign, textColor: "text-green-600", bgColor: "bg-green-50" },
        { title: "Học viên đăng ký", value: "128 học viên", icon: Users, textColor: "text-blue-600", bgColor: "bg-blue-50" },
        { title: "Khóa học đang bật", value: "4 khóa", icon: BookOpen, textColor: "text-purple-600", bgColor: "bg-purple-50" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div >
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Xin chào, Giảng viên {user?.name || ""}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Dưới đây là hiệu suất và thống kê tổng quan các khóa học của bạn.
                    </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
                    <Link href="/teacher/courses">
                        <Plus className="mr-2 h-4 w-4" /> Tạo khóa học mới
                    </Link>
                </Button>
            </div>


            {/* thẻ thống kê */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="shadow-sm">
                            {/* flex flex-row items-center justify-between space-y-0 pb-2 */}
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium text-gray-500">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Khu vực thông báo hoặc mẹo giảng dạy bổ sung */}
            <Card className="p-6 border-dashed border-2 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Mẹo nhỏ dành cho bạn</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Cập nhật đề cương học tập rõ ràng sẽ giúp tăng tỷ lệ hoàn thành khóa học của học viên lên đến 40% đấy!
                </p>
            </Card>
        </div>
    )

}