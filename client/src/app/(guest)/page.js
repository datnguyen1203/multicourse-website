"use client"
import CourseCard from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { courseService } from "@/services/courseService";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getTop3Courses();
        // Lấy đúng 3 khóa học tiêu biểu đầu tiên từ mảng API trả về
        if (Array.isArray(data)) {
          setCourses(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Không thể tải khóa học:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/*Section1: Wellcome banner */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Chinh Phục Kỹ Năng Mới <br /> Với Các Khóa Học Trực Tuyến Xuất Sắc
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
            Học hỏi từ các chuyên gia hàng đầu, làm chủ kiến thức thực tế với lộ trình bài bản và hệ thống bài tập phong phú.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold" asChild>
              <Link href="/">Khám phá ngay</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-orange-600 font-semibold hover:bg-white/10 hover:text-white" asChild>
              <Link href="/">Giảng dạy tại MultiCourse</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section2: hot courses */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Khóa học tiêu biểu</h2>
            <p className="text-sm text-gray-500">Các khóa học chất lượng cao đang được học viên quan tâm nhiều nhất</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">Xem tất cả</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
