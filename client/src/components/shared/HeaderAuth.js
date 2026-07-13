"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function HeaderAuth() {
    const { user, logout, loading } = useAuth();

    const dashboardHref = useMemo(() => {
        if (user?.role === "admin") return "/admin/dashboard";
        if (user?.role === "teacher") return "/teacher/dashboard";
        return "/";
    }, [user?.role]);

    const displayName = user?.name || "User";
    const initials = displayName.slice(0, 2).toUpperCase();

    if (loading) {
        return <div className="h-9 w-29" />;
    }

    if (!user) {
        return (
            <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-orange-400 hover:bg-orange-500">
                    <Link href="/register">Sign up</Link>
                </Button>
            </div>
        );
    }

    return (
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
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
