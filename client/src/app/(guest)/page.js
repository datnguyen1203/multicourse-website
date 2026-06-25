import CourseCard from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  // Giả lập danh sách khóa học lấy từ Backend về để map ra giao diện
  const featuredCourses = [
    {
      id: 1,
      title: "Lập Trình Web Full-Stack Với React & Node.js",
      teacher: "Nguyễn Văn A",
      price: 499000,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
      category: "Công nghệ thông tin"
    },
    {
      id: 2,
      title: "Thiết Kế Đồ Họa Căn Bản Đến Nâng Cao Với Canva",
      teacher: "Trần Thị B",
      price: 299000,
      thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60",
      category: "Thiết kế"
    },
    {
      id: 3,
      title: "Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm",
      teacher: "Michael Smith",
      price: 599000,
      thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60",
      category: "Ngoại ngữ"
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/*Section1: Wellcome banner */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Chinh Phục Kỹ Năng Mới <br /> Với Các Khóa Học Trực Tuyến Xuất Sắc
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
            Học hỏi từ các chuyên gia hàng đầu, làm chủ kiến thức thực tế với lộ trình bài bản và hệ thống bài tập phong phú.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold" asChild>
              <Link href="/">Khám phá ngay</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-green-700 font-semibold hover:bg-white/10 hover:text-white" asChild>
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
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
