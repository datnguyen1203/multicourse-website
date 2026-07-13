"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import categoryService from "@/services/categoryService";
import { courseService } from "@/services/courseService";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UpdateCourseModal({ open, setOpen, courseData, onUpdateSuccess }) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await categoryService.getAllCategories();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([{ _id: "69f994df2174bca39667da19", name: "Web Development" }]);
            }
        }
        if (open) fetchCategories();
    }, [open]);

    useEffect(() => {
        if (courseData) {
            setTitle(courseData.title || "");
            setCategory(courseData.category?._id || courseData.category || "");
            setDescription(courseData.description || "");
            setPrice(courseData.price !== undefined ? courseData.price : "");


            setIsSubmitting(false)
        }
    }, [courseData, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !category || !description || price === "") {
            toast.error("Vui lòng điền đầy đủ tất cả các trường dữ liệu!");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            title,
            description,
            price: Number(price),
            category
        };

        const result = await courseService.updateCourse(courseData._id, payload);

        if (result && (result._id || result.success)) {
            toast.success("Cập nhật thông tin khóa học thành công!");
            onUpdateSuccess(); // Gọi hàm cập nhật lại UI ở trang cha
            setOpen(false);    // Đóng modal
            setIsSubmitting(false)
        } else {
            toast.error(result.message || "Có lỗi xảy ra khi lưu thay đổi!");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">Chỉnh sửa khóa học</DialogTitle>
                    <DialogDescription>Thay đổi thông tin cơ bản của khóa học. Nhấn lưu để áp dụng thay đổi ngay lập tức.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 my-2">
                    {/* Tên khóa học */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Tên khóa học</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Chọn danh mục (Dropdown Select) */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Danh mục khóa học</label>
                        <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn một danh mục khóa học..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name || cat.title || "Danh mục chưa đặt tên"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Giá tiền */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Giá khóa học (đ)</label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={isSubmitting}
                            min={0}
                            required
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                        <Textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <DialogFooter className="pt-2 border-t mt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}