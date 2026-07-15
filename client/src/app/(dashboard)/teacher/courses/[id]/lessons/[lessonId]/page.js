"use client"

import { courseService } from "@/services/courseService";
import { lessonService } from "@/services/lessonService";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, ExternalLink, FileCode, FileText, Loader2, Video } from "lucide-react";
import { Button as ShadButton } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherLessonDetailPage({ params }) {
    const { id: courseId, lessonId } = use(params)
    const router = useRouter();

    const [course, setCourse] = useState(null)
    const [lesson, setLesson] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLessonAndCourse = async () => {
            try {
                const courseData = await courseService.getCourseById(courseId)
                if (courseData) setCourse(courseData)

                const lessonData = await lessonService.getLessonById(lessonId)
                if (lessonData) {
                    console.log(lessonData)
                    setLesson(lessonData)
                } else {
                    toast.error("Không tìm thấy thông tin bài học này!");
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra khi tải dữ liệu bài học!");
            } finally {
                setIsLoading(false)
            }
        }

        fetchLessonAndCourse()
    }, [courseId, lessonId])

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-2 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm">Đang tải chi tiết bài học...</p>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="text-center py-20 space-y-4">
                <p className="text-gray-500">Bài học không tồn tại hoặc đã bị xóa.</p>
                <ShadButton onClick={() => router.push(`/teacher/courses/${courseId}/lessons`)}>
                    Quay lại quản lý bài học
                </ShadButton>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">

                <ShadButton
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/teacher/courses/${courseId}`)}
                    className="hover:bg-slate-100 self-start"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách bài học
                </ShadButton>
                <div className="text-xs md:text-sm text-gray-500 font-medium truncate">
                    Khóa học: <span className="text-gray-900 font-semibold">{course?.title}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="space-y-4 lg:col-span-2">
                    <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden">
                        <CardHeader className="p-4 bg-slate-50/70 border-b">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                                <Video className="h-4 w-4 text-orange-500" /> Video Bài giảng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {lesson.video_url ? (
                                <div className="space-y-3">
                                    <div className="relative aspect-video rounded-md overflow-hidden bg-black shadow-inner">
                                        <video
                                            src={lesson.video_url}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-md bg-slate-50">
                                    Bài học này chưa có video bài giảng.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden">
                        <CardHeader className="p-4 bg-slate-50/70 border-b flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                                <FileText className="h-4 w-4 text-green-500" /> Tài liệu PDF đính kèm
                            </CardTitle>
                            {lesson.document_url && (
                                <a
                                    href={lesson.document_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                                >
                                    Phóng to <ExternalLink className="size-3" />
                                </a>
                            )}
                        </CardHeader>
                        <CardContent className="p-4">
                            {lesson.document_url ? (
                                <div className="space-y-3">
                                    <div className="w-full h-[600px] border border-slate-200 rounded-md overflow-hidden bg-slate-100 shadow-inner">
                                        <iframe
                                            src={`${lesson.document_url}#toolbar=1&navpanes=0&scrollbar=1`}
                                            className="w-full h-full border-none"
                                            title="Lesson Document"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-md bg-slate-50">
                                    Bài học này chưa có tài liệu document bài giảng.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                Bài số: {lesson.number}
                            </span>
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${lesson.status
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                            >
                                {lesson.status ? (
                                    <>
                                        <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-green-600" /> Đang kích hoạt
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="mr-1 h-3.5 w-3.5 text-amber-600" /> Bản nháp / Tạm ẩn
                                    </>
                                )}
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {lesson.title}
                        </h1>

                        <div className="border-t pt-4 space-y-2">
                            <h3 className="text-sm font-semibold text-slate-800">Mô tả bài học:</h3>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg whitespace-pre-line">
                                {lesson.description || "Chưa có mô tả cho bài học này."}
                            </p>
                        </div>

                        {/* Siêu dữ liệu hệ thống */}
                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                            {lesson.created_at && (
                                <span className="flex items-center">
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    Ngày tải lên: {new Date(lesson.created_at).toLocaleString("vi-VN")}
                                </span>
                            )}
                            <span className="flex items-center">
                                <FileCode className="mr-1.5 h-3.5 w-3.5" />
                                Lesson ID: {lesson._id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}