"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { BookOpen, Calendar, Edit, Trash2, Plus, PlayCircle, Loader2, ArrowLeft, Eye, Camera, EyeOff, FileText, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ImageCropperModal from "@/components/shared/ImageCropperModal";
import UpdateCourseModal from "@/components/teacher/UpdateCourseModal";
import { lessonService } from "@/services/lessonService";

export default function TeacherCourseDetailPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    // Thêm các state quản lý việc cắt và upload ảnh mới
    const [cropperOpen, setCropperOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState("");
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const fetchDetail = useCallback(async () => {
        try {
            const data = await courseService.getCourseById(id);
            if (data) setCourse(data);
        } catch (error) {
            toast.error("Không thể tải thông tin khóa học!");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchLessonsList = async () => {
        try {
            const data = await lessonService.getLessonsByCourseId(id);
            if (Array.isArray(data)) {
                // Sắp xếp các bài học tăng dần theo số thứ tự (number)
                const sortedLessons = data.sort((a, b) => Number(a.number || 0) - Number(b.number || 0));
                setLessons(sortedLessons);
            }
        } catch (error) {
            console.error("Không thể tải danh sách bài học:", error);
        }
    };

    useEffect(() => {
        if (user && user.role !== "teacher") {
            toast.error("Bạn không có quyền truy cập vào khu vực quản trị này!");
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            await Promise.all([fetchDetail(), fetchLessonsList()]);
            setIsLoading(false);
        };
        loadAllData();
    }, [id]);

    // Xử lý khi giáo viên click chọn file ảnh từ máy tính
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setRawImageSrc(reader.result);
                setCropperOpen(true); // Mở modal cắt ảnh lên
            });
            reader.readAsDataURL(file);
            e.target.value = null; // Reset input file
        }
    };

    // Nhận file đã cắt từ Modal và tiến hành gọi API upload luôn
    const handleCropComplete = async (croppedFile) => {
        try {
            setIsUploadingImage(true);
            const result = await courseService.updateCourseImage(id, croppedFile);

            if (result?.course) {
                setCourse(result.course);
                toast.success("Cập nhật ảnh khóa học thành công!");
                await fetchDetail();
                router.refresh();
            } else {
                toast.error(result?.message || "Upload ảnh thất bại!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình xử lý ảnh!");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleToggleStatus = async () => {
        setIsTogglingStatus(true);
        const result = await courseService.changeCourseStatus(id);
        setIsTogglingStatus(false);

        if (result && (result.success || result._id)) {
            toast.success(`Đã chuyển khóa học sang trạng thái: ${!course.status ? "Đang mở" : "Tạm ẩn"}`);
            fetchDetail(); // Gọi hàm tải lại chi tiết để cập nhật badge và trạng thái nút trên UI
        } else {
            toast.error(result.message || "Thay đổi trạng thái thất bại!");
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-2 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm">Đang tải dữ liệu quản trị...</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-2 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="text-sm">Đang tải dữ liệu quản trị...</p>
            </div>
        );
    }

    if (!course) {
        return <p className="py-20 text-center text-gray-500">Không tìm thấy khóa học.</p>;
    }

    const createdAtSource = course.date || course.createAt || course.createdAt;
    const createdAt = createdAtSource ? new Date(createdAtSource).toLocaleDateString("vi-VN") : "Chưa cập nhật";
    const lessonsCount = course.lessons?.length || 0;
    const priceValue = Number(course.price);
    const hasValidPrice = Number.isFinite(priceValue) && priceValue >= 0;
    const isFreeCourse = hasValidPrice && priceValue === 0;
    const formattedPrice = !hasValidPrice
        ? "Chưa cập nhật"
        : isFreeCourse
            ? "Miễn phí"
            : new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                currencyDisplay: "code",
                maximumFractionDigits: 0,
            }).format(priceValue);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/teacher/courses")} className="w-fit hover:bg-slate-100">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
                <Button variant="outline" size="sm" className="w-fit" asChild>
                    <Link href={`/courses/${id}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" /> Xem giao diện học viên
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <Card className="border-slate-200">
                        <CardContent className="space-y-4 p-5 sm:p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                                    Chế độ quản trị viên
                                </span>

                                {/* Thẻ hiển thị trạng thái động nằm ngay bên cạnh */}
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm transition-colors duration-300 ${course.status
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-slate-100 text-slate-800 border-slate-200"
                                        }`}
                                >
                                    {/* Thêm một chấm tròn nhỏ màu sắc để giao diện sinh động hơn */}
                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${course.status ? "bg-green-600" : "bg-slate-600"}`} />
                                    {course.status ? "Đang mở" : "Tạm ẩn"}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{course.title}</h1>

                            <p className="text-sm leading-7 text-slate-600 sm:text-base">
                                {course.description || "Khóa học chưa có mô tả."}
                            </p>

                            <div className="grid grid-cols-1 gap-3 border-t pt-4 text-xs text-slate-500 sm:grid-cols-2">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-orange-500" /> Ngày tạo: {createdAt}
                                </div>
                                <div className="flex items-center">
                                    <BookOpen className="mr-2 h-4 w-4 text-orange-500" /> ID: {course._id}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cấu trúc bài giảng hiện tại</h2>
                            <span className="text-xs text-gray-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full border">
                                Tổng số: {lessons.length} bài
                            </span>
                        </div>

                        {lessons.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full bg-white border rounded-xl px-4 shadow-sm">
                                {lessons.map((lesson, idx) => (
                                    <AccordionItem key={lesson._id || idx} value={`item-${idx}`} className="border-b last:border-0 py-1">
                                        <AccordionTrigger className="hover:no-underline font-medium text-gray-800 text-sm py-3.5">
                                            <div className="flex items-center justify-between w-full pr-4">
                                                <span className="flex items-center text-left">
                                                    <PlayCircle className="mr-3 h-4 w-4 text-blue-500 flex-shrink-0" />
                                                    Bài {lesson.number || idx + 1}: {lesson.title}
                                                </span>
                                                {/* Badge trạng thái của bài học */}
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${lesson.status ? "bg-green-50 text-green-700 border border-green-100" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
                                                    {lesson.status ? "Kích hoạt" : "Bản nháp"}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-500 pl-7 pb-4 text-xs space-y-3 leading-relaxed">
                                            <p>{lesson.description || "Chưa có mô tả chi tiết cho bài giảng này."}</p>

                                            {/* Các nút xem tài liệu học đính kèm (video, document) */}
                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                {lesson.video_url && (
                                                    <a
                                                        href={lesson.video_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Video className="h-3 w-3" /> Xem Video bài học
                                                    </a>
                                                )}
                                                {lesson.document_url && (
                                                    <a
                                                        href={lesson.document_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
                                                    >
                                                        <FileText className="h-3 w-3" /> Tải tài liệu đính kèm
                                                    </a>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="p-8 border border-dashed rounded-xl bg-white text-center text-sm text-gray-500">
                                Khóa học này chưa có nội dung bài giảng. Hãy bấm nút "Thêm bài giảng" để bắt đầu xây dựng giáo trình.
                            </div>
                        )}
                    </div>
                </div>

                <div className="xl:sticky xl:top-24 xl:h-fit">
                    <Card className="overflow-hidden border-slate-200">
                        {/* <div className="relative aspect-video bg-slate-100">
                            <Image
                                src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"}
                                alt={course.title || "Khóa học"}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </div> */}

                        <div className="aspect-video bg-slate-100 relative group">
                            <Image
                                src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"}
                                alt={course.title || "Khóa học"}
                                fill
                                unoptimized
                                className="object-cover"
                            />

                            {isUploadingImage && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 text-white">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="text-xs font-medium">Đang cập nhật ảnh...</span>
                                </div>
                            )}

                            {/* Lớp overlay phủ lên khi rà chuột vào ảnh, chứa nút Đổi ảnh */}
                            <label
                                htmlFor="quick-image-upload"
                                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium space-y-1"
                            >
                                {isUploadingImage ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                        <span>Đang tải lên...</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="h-5 w-5 text-white mb-1" />
                                        <span>Thay đổi ảnh nền</span>
                                    </>
                                )}
                            </label>
                            <input
                                id="quick-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={isUploadingImage}
                            />
                        </div>
                        <CardContent className="space-y-4 bg-slate-50/60 p-4">
                            <div className="rounded-lg border bg-white p-3">
                                <p className="text-xs font-medium text-slate-500">Giá hiện tại</p>
                                <p className="mt-1 text-xl font-bold text-slate-900">
                                    {formattedPrice}
                                </p>
                                {!isFreeCourse && hasValidPrice && <p className="mt-1 text-xs text-slate-500">Đơn vị tiền tệ: VND</p>}
                            </div>

                            <Button className="w-full justify-start bg-orange-400 hover:bg-orange-500" asChild disabled={isUploadingImage}>
                                <Link href={`/teacher/courses/${id}/lessons`}>
                                    <Plus className="mr-2 h-4 w-4" /> Thêm bài giảng mới
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start border-orange-200 bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                asChild
                                disabled={isUploadingImage}
                            >
                                <Button
                                    variant="outline"
                                    className="cursor-pointer    w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white"
                                    onClick={() => setUpdateModalOpen(true)}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
                                </Button>
                            </Button>

                            <Button
                                variant="outline"
                                className={`cursor-pointer w-full justify-start bg-white border ${course.status
                                    ? "text-slate-700 hover:bg-slate-600 hover:text-white border-slate-200"
                                    : "text-green-700 hover:bg-green-600 hover:text-white border-green-200"
                                    }`}
                                onClick={handleToggleStatus}
                                disabled={isTogglingStatus}
                            >
                                {isTogglingStatus ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : course.status ? (
                                    <EyeOff className="mr-2 h-4 w-4" />
                                ) : (
                                    <Eye className="mr-2 h-4 w-4" />
                                )}
                                {course.status ? "Ẩn khóa học này" : "Mở lại khóa học này"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>


            <ImageCropperModal
                open={cropperOpen}
                setOpen={setCropperOpen}
                imageSrc={rawImageSrc}
                onCropComplete={handleCropComplete}
            />
            <UpdateCourseModal
                open={updateModalOpen}
                setOpen={setUpdateModalOpen}
                courseData={course} // Truyền data hiện tại của khóa học sang modal
                onUpdateSuccess={fetchDetail} // Gọi lại hàm lấy chi tiết để cập nhật giao diện sau khi sửa thành công
            />
        </div>
    );
}
