"use client";

import { Delete, Edit, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import UpdateCourseModal from "./UpdateCourseModal";
import { useState } from "react";
import { courseService } from "@/services/courseService";
import { toast } from "sonner";

export default function TeacherCourseCard({ course, onDelete, onUpdateSuccess }) {
    const { _id, title, description, price, image, status } = course;
    const priceValue = Number(price);
    const hasValidPrice = Number.isFinite(priceValue) && priceValue >= 0;
    const isFreeCourse = hasValidPrice && priceValue === 0;
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
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

    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const handleToggleStatus = async () => {
        setIsTogglingStatus(true);
        const result = await courseService.changeCourseStatus(_id);
        setIsTogglingStatus(false);

        if (result && (result.success || result._id)) {
            toast.success(`Đã chuyển khóa học sang trạng thái: ${!status ? "Đang mở" : "Tạm ẩn"}`);

            // Gọi hàm reload từ trang cha truyền vào để cập nhật lại giao diện ngay lập tức
            if (typeof onUpdateSuccess === "function") {
                onUpdateSuccess();
            }
        } else {
            toast.error(result.message || "Thay đổi trạng thái thất bại!");
        }
    };

    return (
        <Card className="p-0 group overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className={`absolute z-1 ml-3 mt-3 inline-flex items-center rounded-full ${status ? `bg-orange-500` : "bg-gray-600"} px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur`}>
                <span>{status ? "Đang mở" : "Tạm ẩn"}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <Image
                        src={image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500"}
                        alt={title || "Khóa học"}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/45 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                            <h1
                                className="text-base font-bold leading-6 text-slate-950 line-clamp-2 h-[48px] flex-1 items-start"
                                title={title}
                            >
                                {title}
                            </h1>
                            <div className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 sm:text-sm">
                                {formattedPrice}
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-600 truncate" title={description}>
                            {description}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        <Button asChild variant="outline" className="border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white">
                            <Link href={`/teacher/courses/${_id}`} className="flex items-center justify-center gap-2">
                                <Eye className="size-4" />
                                <span>Xem</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="cursor-pointer border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2"
                            onClick={() => setUpdateModalOpen(true)}
                        >
                            <Edit className="size-4" />
                            <span>Sửa</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={`cursor-pointer flex items-center justify-center gap-2 ${status
                                ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-600 hover:text-white"
                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white"
                                }`}
                            onClick={handleToggleStatus}
                            disabled={isTogglingStatus} // Khóa nút khi đang gửi request
                        >
                            {isTogglingStatus ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : status ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                            <span>{status ? "Ẩn đi" : "Mở lại"}</span>
                        </Button>
                    </div>
                </div>
            </div>
            <UpdateCourseModal
                open={updateModalOpen}
                setOpen={setUpdateModalOpen}
                courseData={course} // Truyền data hiện tại của khóa học sang modal
                onUpdateSuccess={onUpdateSuccess} // Gọi lại hàm lấy chi tiết để cập nhật giao diện sau khi sửa thành công
            />
        </Card>
    );
}