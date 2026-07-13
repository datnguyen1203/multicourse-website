"use client"

import Link from "next/link";
import dynamic from "next/dynamic";

const HeaderAuth = dynamic(() => import("./HeaderAuth"), {
    ssr: false,
    loading: () => <div className="h-9 w-29" />,
});

const HeaderDashboardLink = dynamic(() => import("./HeaderDashboardLink"), {
    ssr: false,
    loading: () => <Link href="/" className="hover:text-orange-500 transition-colors">Dashboard</Link>,
});

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-orange-500 tracking-tight">MultiCourse</span>
                </Link>
                {/* Dieu huong chinh */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                    <HeaderDashboardLink />
                    <Link href="/" className="hover:text-orange-500 transition-colors">About us</Link>
                    <Link href="/" className="hover:text-orange-500 transition-colors">Contact</Link>
                </nav>
                <HeaderAuth />
            </div>
        </header>
    )
}