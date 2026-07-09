import Link from "next/link";

export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-orange-500 tracking-tight">
                        <Link href="/">Multicourse</Link>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">Nền tảng học trực tuyến thế hệ mới</p>
                </div>
                {children}
            </div>
        </div>
    )
}