import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CourseCard({ course }) {
    // Map đúng các trường từ API của bạn (_id, title, price, image)
    const { _id, title, price, image, category } = course;
    const priceValue = Number(price);
    const hasValidPrice = Number.isFinite(priceValue) && priceValue >= 0;
    const isFreeCourse = hasValidPrice && priceValue === 0;
    const formattedPrice = !hasValidPrice
        ? "Chưa cập nhật"
        : isFreeCourse
            ? "Miễn phí"
            : new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                currencyDisplay: "code",
                maximumFractionDigits: 0,
            }).format(priceValue);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                    src={image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500"} // Có ảnh fallback nếu lỗi
                    alt={title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {/* Nếu category là một Object chứa tên danh mục, hãy dùng category.name, còn nếu là ID tạm thời để trống hoặc ẩn đi */}
                {category && typeof category === "object" && (
                    <span className="absolute top-3 left-3 bg-white/90 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded shadow-sm backdrop-blur-sm">
                        {category.name}
                    </span>
                )}
            </div>

            {/* Nội dung Card */}
            <CardHeader className="p-4 pb-2 flex-1">
                <CardTitle className="text-base font-bold line-clamp-2 hover:text-orange-500 transition-colors">
                    <Link href={`/courses/${_id}`}>{title}</Link>
                </CardTitle>
                <p className="text-xs text-gray-400 mt-1">MultiCourse Academy</p>
            </CardHeader>

            {/* Phần chân Card */}
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-4 bg-slate-50/50">
                <span className="text-base font-bold text-gray-900">
                    {formattedPrice}
                </span>
                <Button size="sm" variant="ghost" className="text-orange-500 hover:text-orange-600 p-0 font-medium cursor-pointer" asChild>
                    <Link href={`/courses/${_id}`}>Xem chi tiết →</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}