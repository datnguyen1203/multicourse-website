"use client";

import { Delete, Edit, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";

export default function TeacherCourseCard({ course, onDelete }) {
    const { _id, title, description, price, image, status } = course;
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
                            <h1 className="text-lg font-semibold leading-6 text-slate-900">
                                {title}
                            </h1>
                            <div className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                                {price}
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">
                            {description}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        <Button asChild variant="outline" className="border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white">
                            <Link href="/teacher/courses" className="flex items-center justify-center gap-2">
                                <Eye className="size-4" />
                                <span>Xem</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white">
                            <Link href="/teacher/courses" className="flex items-center justify-center gap-2">
                                <Edit className="size-4" />
                                <span>Sửa</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white"
                            onClick={() => onDelete?.(_id)}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Delete className="size-4" />
                                <span>Xóa</span>
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}