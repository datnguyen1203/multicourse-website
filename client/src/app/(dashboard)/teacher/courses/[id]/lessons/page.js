"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { courseService } from "@/services/courseService";
import { lessonService } from "@/services/lessonService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, PlayCircle, Loader2, ListOrdered, Video, FileText } from "lucide-react";
import Link from "next/link";

export default function ManageLessonsPage({ params }) {
    const { id: courseId } = use(params);
    const router = useRouter();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State quản lý Form
    const [number, setNumber] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);

    const fetchLessonsList = async () => {
        const lessonsData = await lessonService.getLessonsByCourseId(courseId);
        if (Array.isArray(lessonsData)) {
            setLessons(lessonsData);
            // Gợi ý số thứ tự bài tiếp theo bằng cách tìm số lớn nhất hiện tại + 1
            const maxNumber = lessonsData.reduce((max, lesson) => Math.max(max, Number(lesson.number || 0)), 0);
            setNumber((maxNumber + 1).toString());
        }
    };

    // Hàm tải thông tin chung của khóa học
    const fetchCourseInfo = async () => {
        try {
            const courseData = await courseService.getCourseById(courseId);
            if (courseData) setCourse(courseData);
        } catch (error) {
            toast.error("Không thể tải thông tin khóa học!");
        }
    };

    // Chạy tải dữ liệu khi trang được load
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            await Promise.all([fetchCourseInfo(), fetchLessonsList()]);
            setIsLoading(false);
        };
        loadAllData();
    }, [courseId]);

    // Xử lý gửi Form tạo bài học mới
    const handleCreateLesson = async (e) => {
        e.preventDefault();

        if (!number.trim() || !title.trim() || !description.trim()) {
            toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("course_id", courseId);
        formData.append("number", number);
        formData.append("title", title);
        formData.append("description", description);

        if (videoFile) formData.append("video", videoFile);
        if (documentFile) formData.append("document", documentFile);

        const result = await lessonService.createLesson(formData);
        setIsSubmitting(false);

        if (result && (result._id || result.success)) {
            toast.success("Thêm bài học mới thành công!");
            // Reset Form
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setDocumentFile(null);

            document.getElementById("video-input").value = "";
            document.getElementById("document-input").value = "";

            await fetchLessonsList();
        } else {
            toast.error(result.message || "Tạo bài học thất bại!");
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-2 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <p className="text-sm">Đang đồng bộ danh sách bài học...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/teacher/courses/${courseId}`)} className="hover:bg-slate-100">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại chi tiết khóa học
                </Button>
                <div className="text-sm text-gray-500 font-medium truncate max-w-xs md:max-w-md">
                    Khóa học: <span className="text-gray-900 font-semibold">{course?.title}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-2">
                    <Card className="shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                <Plus className="mr-2 h-5 w-5 text-orange-600" /> Thêm bài giảng mới
                            </CardTitle>
                            <CardDescription>Hệ thống tự động đồng bộ tài liệu học tập lên cloud đám mây.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateLesson} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Số thứ tự bài học</label>
                                    <Input
                                        type="number"
                                        placeholder="Ví dụ: 1"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Tiêu đề bài học</label>
                                    <Input
                                        type="text"
                                        placeholder="Ví dụ: Bài 1 - Giới thiệu về HTML..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Nội dung / Mô tả ngắn</label>
                                    <Textarea
                                        placeholder="Nhập nội dung học tập của bài này..."
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Video className="h-4 w-4 text-slate-500" /> Video bài giảng
                                    </label>
                                    <Input
                                        id="video-input"
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setVideoFile(e.target.files[0])}
                                        disabled={isSubmitting}
                                    />
                                    {videoFile && <p className="text-xs text-orange-600 font-medium truncate">Đã chọn: {videoFile.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <FileText className="h-4 w-4 text-slate-500" /> Tài liệu đính kèm (PDF, Docx...)
                                    </label>
                                    <Input
                                        id="document-input"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                        onChange={(e) => setDocumentFile(e.target.files[0])}
                                        disabled={isSubmitting}
                                    />
                                    {documentFile && <p className="text-xs text-green-600 font-medium truncate">Đã chọn: {documentFile.name}</p>}
                                </div>

                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải file lên...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-1.5 h-4 w-4" /> Thêm vào giáo trình
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center space-x-2 text-gray-900 font-bold text-lg px-1">
                        <ListOrdered className="h-5 w-5 text-orange-600" />
                        <h2>Cấu trúc giáo trình hiện tại ({lessons.length})</h2>
                    </div>

                    {lessons.length > 0 ? (
                        <div className="space-y-3">
                            {lessons
                                .sort((a, b) => Number(a.number) - Number(b.number)) // Đảm bảo sắp xếp đúng số thứ tự tăng dần
                                .map((lesson, idx) => (
                                    <Card key={lesson._id || idx} className="bg-white shadow-sm hover:border-slate-300 transition-all">
                                        <CardContent className="p-4 flex items-start justify-between gap-4">
                                            <div className="flex items-start space-x-3 min-w-0 w-full">
                                                <PlayCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                                <div className="space-y-1 min-w-0 w-full">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <h3 className="font-semibold text-gray-900 text-sm">
                                                                Bài {lesson.number}: {lesson.title}
                                                            </h3>
                                                            {/* Badge trạng thái bài học */}
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${lesson.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                                                {lesson.status ? "Kích hoạt" : "Bản nháp"}
                                                            </span>
                                                        </div>
                                                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0">
                                                            <Link href={`/teacher/courses/${courseId}/lessons/${lesson._id}`}>
                                                                Xem chi tiết →
                                                            </Link>
                                                        </Button>
                                                    </div>

                                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                        {lesson.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                                        {lesson.video_url && (
                                                            <a
                                                                href={lesson.video_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition-colors"
                                                            >
                                                                <Video className="h-3 w-3" /> Xem Video bài giảng
                                                            </a>
                                                        )}
                                                        {lesson.document_url && (
                                                            <a
                                                                href={lesson.document_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
                                                            >
                                                                <FileText className="h-3 w-3" /> Tải tài liệu (.pdf)
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    ) : (
                        <div className="p-12 border border-dashed rounded-xl bg-white text-center text-sm text-gray-400">
                            Chưa có bài học nào được tạo. Hãy sử dụng bảng điều khiển bên cạnh để thêm bài giảng đầu tiên!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}