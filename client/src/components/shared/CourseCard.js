import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export default function CourseCard({ course }) {
    const { id, title, teacher, price, thumbnail, category } = course;
    return (
        // relative aspect-video w-full overflow-hidden bg-slate-100
        <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img src={thumbnail}
                    alt={title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                {category && (
                    <span className="absolute top-3 left-3 bg-white/90 text-green-700 text-xs font-semibold px-2.5 py-1 rounded shadow-sm backdrop-blur-sm">{category}</span>
                )}
            </div>
            <CardHeader className="p-4 pb-2 flex-1">
                <CardTitle className="text-base font-bold line-clamp-2 hover:text-green-600 transition-colors">
                    <Link href="/">{title}</Link>
                </CardTitle>
                <p className="text-xs text-gray-400 mt-1">
                    Teacher: <span className="font-medium text-gray-600">{teacher}</span>
                </p>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-4 bg-slate-50/50">
                <span className="text-base font-bold text-gray-900">
                    {price === 0 ? "Free" : `${price.toLocaleString("vi-VN")} VND`}
                </span>
                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 p-0 font-medium cursor-pointer" asChild>
                    <Link href="/">View detail →</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}