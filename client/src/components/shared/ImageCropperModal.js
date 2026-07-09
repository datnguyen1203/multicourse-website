"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function ImageCropperModal({ open, setOpen, imageSrc, onCropComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => setCrop(crop);
    const onZoomChange = (zoom) => setZoom(zoom);

    const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Hàm tạo file ảnh mới sau khi đã cắt bằng thẻ <canvas>
    const createCroppedImage = async () => {
        try {
            const image = new Image();
            image.src = imageSrc;
            await new Promise((resolve) => (image.onload = resolve));

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Đặt chiều rộng và chiều cao mong muốn (Ví dụ: Banner chuẩn 800x450 hoặc giữ nguyên độ phân giải vùng cắt)
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            // Chuyển canvas thành File Object để sẵn sàng ném vào FormData
            canvas.toBlob((blob) => {
                if (!blob) return;
                const croppedFile = new File([blob], "cropped-thumbnail.jpg", { type: "image/jpeg" });
                onCropComplete(croppedFile, canvas.toDataURL("image/jpeg"));
                setOpen(false);
            }, "image/jpeg");

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Cắt ảnh đại diện khóa học</DialogTitle>
                </DialogHeader>

                {/* Khung chứa ảnh để cắt */}
                <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden mt-2">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9} // Giới hạn tỉ lệ khung hình chữ nhật chuẩn khóa học (16:9)
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                    />
                </div>

                {/* Thanh trượt Phóng to / Thu nhỏ */}
                <div className="space-y-2 mt-4">
                    <span className="text-xs font-medium text-gray-500">Phóng to / Thu nhỏ</span>
                    <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) => setZoom(value[0])}
                    />
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button className="bg-orange-400 hover:bg-orange-500" onClick={createCroppedImage}>Xác nhận cắt ảnh</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}