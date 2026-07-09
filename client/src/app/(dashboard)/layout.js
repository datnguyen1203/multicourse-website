"use client"

import AutoBreadcrumb from "@/components/shared/AutoBreadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/authContext";
import { BookOpen, LayoutDashboard, LogOut, Menu, UserCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Định nghĩa các nút menu cho từng Role
    const menuConfig = {
        teacher: [
            { name: "Tổng quan", href: "/teacher/dashboard", icon: LayoutDashboard },
            { name: "Quản lý khóa học", href: "/teacher/courses", icon: BookOpen },
        ],
        student: [
            { name: "Khóa học của tôi", href: "/student/dashboard", icon: BookOpen },
        ],
        admin: [
            { name: "Tổng quan sàn", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Quản lý người dùng", href: "/admin/users", icon: UserCheck },
        ],
    };

    const currentMenu = mounted ? (menuConfig[user?.role] || []) : [];

    const SidebarContent = () => (
        <div className="flex h-full flex-col justify-between bg-orange-600 backdrop-blur  text-white p-4">
            <div className="space-y-6">
                <div className="px-3 py-2 text-xl font-bold tracking-tight text-white border-b border-orange-400 pb-4">
                    MultiCourse Panel
                </div>

                {/* Menu list */}
                <nav className="space-y-1">
                    {currentMenu.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                            >
                                <span className={`flex items-center space-x-3 px-3 my-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${isActive ? "bg-orange-200 text-orange-700" : "text-white hover:bg-orange-600 hover:text-white"
                                    }`}>
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <Button variant="ghost" onClick={logout}
                className="w-full justify-start text-orange-200 hover:bg-orange-600 hover:text-white text-sm font-medium">
                <LogOut className="mr-3 h-4 w-4 text-destructive text-white" />
                Đăng xuất
            </Button>
        </div>
    );

    if (!mounted) {
        return <div className="min-h-screen bg-slate-50 animate-pulse" />; // Hoặc một màn hình loading nhẹ
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
                <SidebarContent />
            </aside>

            <div className="flex flex-1 flex-col md:pl-64">
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
                    <span className="font-bold text-orange-700">MultiCourse</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="bg-orange-700">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r-0 bg-orange-700">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>
                <div className="flex flex-1 flex-col md:pl-10">
                    <main className="flex-1 p-6 md:p-8">
                        <AutoBreadcrumb />
                        {children}
                    </main>
                </div>

            </div>
        </div>
    );
}