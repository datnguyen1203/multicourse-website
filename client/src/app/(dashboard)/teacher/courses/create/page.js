"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { courseService } from "@/services/courseService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageCropperModal from "@/components/shared/ImageCropperModal";

export default function CreateCoursePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State quản lý dữ liệu form
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    //Cắt ảnh
    const [cropperOpen, setCropperOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState("");

    // Xử lý khi chọn file ảnh để hiển thị Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setRawImageSrc(reader.result); // Lưu chuỗi base64 của ảnh gốc
                setCropperOpen(true);          // Mở modal cắt ảnh lên
            });
            reader.readAsDataURL(file);
            e.target.value = null; // Reset input để có thể chọn lại chính file đó nếu muốn
        }
    };

    // Hàm nhận kết quả sau khi đã cắt thành công từ Modal
    const handleCropComplete = (croppedFile, previewUrl) => {
        setImageFile(croppedFile);   // File đã cắt chuẩn kích thước/tỉ lệ để gửi API
        setImagePreview(previewUrl); // Link preview ảnh đã cắt để hiện lên UI
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !category || !description || !price || !imageFile) {
            toast.error("Vui lòng điền đầy đủ thông tin và chọn ảnh nền khóa học!");
            return;
        }

        setIsSubmitting(true);

        // Khởi tạo đối tượng FormData khớp chuẩn đét với Postman của bạn
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("price", Number(price));
        formData.append("image", imageFile); // File thực tế từ input type="file"

        const result = await courseService.createCourse(formData);
        setIsSubmitting(false);

        // Giả sử API thành công trả về object hoặc field chứa _id của khóa học mới
        // Ví dụ: result._id hoặc result.course._id tùy theo cấu trúc Backend của bạn
        if (result && (result._id || result.success)) {
            const courseId = result._id || result.course?._id;

            toast.success("Tạo khóa học thành công!");

            // Chuyển hướng sang trang tạo bài học cho khóa học này
            if (courseId) {
                router.push(`/teacher/courses/${courseId}/`);
            } else {
                // Fallback nếu không tìm thấy id trong phản hồi
                router.push("/teacher/courses");
            }
        } else {
            toast.error(result.message || "Đã có lỗi xảy ra khi tạo khóa học!");
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data || []);
                if ((!category || category === "") && Array.isArray(data) && data.length > 0) {
                    setCategory(data[0]._id || data[0].id || "");
                }
            } catch (error) {
                toast.error("Không thể tải danh sách danh mục");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Nút quay lại nhanh */}
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/teacher/courses">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                    </Link>
                </Button>
            </div>

            <Card className="shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Tạo khóa học mới</CardTitle>
                    <CardDescription>Điền các thông tin cơ bản để thiết lập nền móng cho khóa học của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Tên khóa học */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Tên khóa học</label>
                            <Input
                                type="text"
                                placeholder="Ví dụ: Web Development Basics..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Danh mục */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Danh mục</label>
                            <Select
                                onValueChange={(val) => setCategory(val)}
                                defaultValue={category}
                                value={category}
                                disabled={isSubmitting || isLoadingCategories}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isLoadingCategories ? "Đang tải..." : "Chọn danh mục"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length === 0 ? (
                                        <SelectItem value="">Không có danh mục</SelectItem>
                                    ) : (
                                        categories.map((c) => (
                                            <SelectItem key={c._id || c.id} value={c._id || c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mô tả ngắn */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Mô tả khóa học</label>
                            <Textarea
                                placeholder="Nhập mô tả chi tiết về nội dung học viên sẽ đạt được..."
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Giá tiền */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Giá khóa học (đ)</label>
                            <Input
                                type="number"
                                placeholder="Ví dụ: 299000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={isSubmitting}
                                min={0}
                                required
                            />
                        </div>

                        {/* Upload hình ảnh khóa học */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Hình ảnh đại diện khóa học</label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/70 transition-colors relative">
                                {imagePreview ? (
                                    <div className="relative aspect-video w-full max-w-xs rounded-lg overflow-hidden shadow-inner">
                                        <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                        <label htmlFor="file-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity cursor-pointer font-medium">
                                            Thay đổi ảnh
                                        </label>
                                    </div>
                                ) : (
                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer py-4 w-full">
                                        <div className="p-3 bg-white rounded-full shadow-sm text-slate-500">
                                            <Upload className="h-5 w-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Nhấp để tải ảnh lên</p>
                                        <p className="text-xs text-slate-400">Hỗ trợ JPG, PNG, WEBP...</p>
                                    </label>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Nút gửi form */}
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 mt-4" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tải lên và khởi tạo khóa học...
                                </>
                            ) : (
                                "Tiến hành tạo bài học →"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <ImageCropperModal
                open={cropperOpen}
                setOpen={setCropperOpen}
                imageSrc={rawImageSrc}
                onCropComplete={handleCropComplete}
            />
        </div>
    );
}