"use client"

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header() {
    const { user, logout, loading } = useAuth();

    const dashboardHref = useMemo(() => {
        if (user?.role === "admin") return "/admin/dashboard";
        if (user?.role === "teacher") return "/teacher/dashboard";
        return "/";
    }, [user?.role]);

    const displayName = user?.name || "User";
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-orange-500 tracking-tight">MultiCourse</span>
                </Link>
                {/* Dieu huong chinh */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                    <Link href={dashboardHref} className="hover:text-orange-500 transition-colors">Dashboard</Link>
                    <Link href="/" className="hover:text-orange-500 transition-colors">About us</Link>
                    <Link href="/" className="hover:text-orange-500 transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    {loading ? null : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="cursor-pointer">
                                <Avatar className="h-9 w-9 border border-gray-200">
                                    <AvatarImage src={user.avatar} alt={displayName} />
                                    <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <p className="font-medium text-gray-900">{displayName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Điều hướng nhanh về Dashboard tùy theo Role */}
                                <DropdownMenuItem asChild>
                                    <Link href={dashboardHref}>Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/">Profile</Link>
                                </DropdownMenuItem>
                                {user.role === "student" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/">My Courses</Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={logout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild className="bg-orange-400 hover:bg-orange-500">
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}