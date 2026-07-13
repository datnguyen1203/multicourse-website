"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/authContext";

export default function HeaderDashboardLink() {
    const { user } = useAuth();

    const dashboardHref = useMemo(() => {
        if (user?.role === "admin") return "/admin/dashboard";
        if (user?.role === "teacher") return "/teacher/dashboard";
        if (user?.role === "student") return "/student/dashboard";
        return "/";
    }, [user?.role]);

    return (
        <Link href={dashboardHref} className="hover:text-orange-500 transition-colors">
            Dashboard
        </Link>
    );
}
