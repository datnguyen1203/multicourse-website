"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Loader2 } from "lucide-react";
import TeacherCourseCard from "@/components/shared/TeacherCourseCard";
import { courseService } from "@/services/courseService";
import { toast } from "sonner";
import Link from "next/link";

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeacherCourses = async () => {
        try {
            setIsLoading(true);
            const data = await courseService.getTeacherCourses();
            if (Array.isArray(data)) {
                setCourses(data);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách khóa học của bạn!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherCourses();
    }, []);

    const handleDeleteCourse = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa khóa học này không? Hành động này không thể hoàn tác.")) {
            try {
                // Tạm thời gọi thông báo, sau này bạn bổ sung hàm: await courseService.deleteCourse(id)
                toast.success("Yêu cầu xóa khóa học đã được ghi nhận!");
                // Cập nhật lại UI sau khi xóa thành công
                setCourses((prev) => prev.filter((c) => c._id !== id));
            } catch (error) {
                toast.error("Xóa khóa học thất bại!");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Tiêu đề & Nút tạo mới */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý khóa học</h1>
                    <p className="text-sm text-gray-500">Nơi bạn thiết lập, chỉnh sửa và đăng tải nội dung giảng dạy</p>
                </div>
                <Button className="bg-orange-400 hover:bg-orange-500" asChild>
                    <Link href="/teacher/courses/create">
                        <Plus className="mr-2 h-4 w-4" /> Tạo khóa học mới
                    </Link>
                </Button>
            </div>

            {/* Danh sách khóa học */}
            {isLoading ? (
                <div className="flex h-40 flex-col items-center justify-center space-y-2 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    <p className="text-sm">Đang tải danh sách khóa học...</p>
                </div>
            ) : courses.length > 0 ? (
                <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4">
                    {courses.map((course) => (
                        <TeacherCourseCard
                            key={course._id}
                            course={course}
                            onDelete={handleDeleteCourse}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-xl bg-white space-y-4">
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-full">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-gray-950 text-base">Bạn chưa có khóa học nào</h3>
                        <p className="text-sm text-gray-500 max-w-sm">Hãy bắt đầu chia sẻ kiến thức của bạn bằng cách tạo khóa học trực tuyến đầu tiên ngay hôm nay.</p>
                    </div>
                    <Button className="bg-orange-400 hover:bg-orange-500" asChild>
                        <Link href="/teacher/courses/create">Tạo khóa học ngay</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}