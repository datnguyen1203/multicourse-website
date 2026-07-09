"use client"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import React from "react";

const routeMap = {
    teacher: "Giảng viên",
    student: "Học viên",
    admin: "Quản trị viên",
    dashboard: "Tổng quan",
    courses: "Quản lý khóa học",
    create: "Tạo mới",
    edit: "Chỉnh sửa",
    profile: "Hồ sơ",
}

const unclickableSegments = ["teacher", "student", "admin"];

export default function AutoBreadcrumb() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter((item) => item != "")

    if (segments.length === 0) return null;

    return (
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                {/* Homepage always first */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/" className="hover:text-orange-700 transition-colors">
                            <HomeIcon className="w-5 h-5" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;

                    const isUnclickable = unclickableSegments.includes(segment);

                    const label = routeMap[segment] || segment;

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast || isUnclickable ? (
                                    <BreadcrumbPage className={`capitalize text-lg  ${isLast ? "font-semiboldtext-gray-900" : "text-gray-500"}`}>
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href} className="font-semibold hover:text-orange-500 text-lg text-gray-500 transition-colors capitalize">
                                            {label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )

}