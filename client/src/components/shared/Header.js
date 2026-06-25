"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header() {
    const user = {
        name: "Tiến Đạt",
        role: "student", // hoặc 'teacher', 'admin'
        avatar: "https://assets.pokemon-zone.com/champions-assets/uicontents/scriptableobject/mdicon02/mdiconpersonal02/standard02/ui_PokeIcon_02_0670_05_0.webp",
    };
    // const user = ""

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-green-600 tracking-tight">MultiCourse</span>
                </Link>
                {/* Dieu huong chinh */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-green-600 transition-colors">Courses</Link>
                    <Link href="/" className="hover:text-green-600 transition-colors">About us</Link>
                    <Link href="/" className="hover:text-green-600 transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="cursor-pointer">
                                <Avatar className="h-9 w-9 border border-gray-200">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Điều hướng nhanh về Dashboard tùy theo Role */}
                                <DropdownMenuItem asChild>
                                    <Link href="/">Dashboard</Link>
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
                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild>
                                <Link href="/">Login</Link>
                            </Button>
                            <Button asChild className="bg-green-600 hover:bg-green-700">
                                <Link href="/">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}