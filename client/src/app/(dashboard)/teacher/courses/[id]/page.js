"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { BookOpen, Calendar, Edit, Trash2, Plus, PlayCircle, Loader2, ArrowLeft, Eye, Camera, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ImageCropperModal from "@/components/shared/ImageCropperModal";
import UpdateCourseModal from "@/components/teacher/UpdateCourseModal";

export default function TeacherCourseDetailPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
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

    useEffect(() => {
        if (user && user.role !== "teacher") {
            toast.error("Bạn không có quyền truy cập vào khu vực quản trị này!");
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            void fetchDetail();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [fetchDetail]);

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

                    <Card className="border-slate-200">
                        <CardContent className="space-y-4 p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Cấu trúc bài giảng</h2>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                    {lessonsCount} bài
                                </span>
                            </div>

                            {lessonsCount > 0 ? (
                                <Accordion type="single" collapsible className="w-full rounded-lg border bg-white px-4">
                                    {course.lessons.map((lesson, idx) => (
                                        <AccordionItem key={lesson._id || idx} value={`item-${idx}`} className="border-b last:border-0">
                                            <AccordionTrigger className="py-3 text-left text-sm font-medium text-slate-800 hover:no-underline">
                                                <span className="flex items-center">
                                                    <PlayCircle className="mr-3 h-4 w-4 shrink-0 text-orange-500" />
                                                    <span className="line-clamp-1">Bài {idx + 1}: {lesson.title}</span>
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-3 pl-7 text-xs leading-relaxed text-slate-500 sm:text-sm">
                                                {lesson.description || "Chưa có mô tả chi tiết cho bài giảng này."}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">
                                    Khóa học này chưa có nội dung bài giảng. Hãy bấm nút &quot;Thêm bài giảng mới&quot; để bắt đầu xây dựng đề cương.
                                </div>
                            )}
                        </CardContent>
                    </Card>
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
                                    className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white"
                                    onClick={() => setUpdateModalOpen(true)}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
                                </Button>
                            </Button>

                            <Button
                                variant="outline"
                                className={`w-full justify-start bg-white border ${course.status
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
