import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-slate-50 text-gray-600">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">MultiCourse</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Nền tảng học trực tuyến chất lượng cao, giúp bạn nâng cao kỹ năng ứng dụng thực tế.</p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-green-600">All courses</Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-green-600">Become a teacher</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-green-600">Support center</Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-green-600">Private policy</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t py-6 text-center text-xs text-gray-400 bg-white">
                © {new Date().getFullYear()} MultiCourse. All rights reserved.
            </div>
        </footer>
    )
}