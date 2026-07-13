import api from "./api";

export const courseService = {
    getTop3Courses: async () => {
        try {
            const response = await api.get("/courses/top3");
            return response.data;
        } catch (error) {
            console.error("Error fetching featured courses:", error);
            throw error;
        }
    },

    getTeacherCourses: async () => {
        try {
            const response = await api.get("/courses/teacher");
            return response.data;
        } catch (error) {
            console.error("Error fetching featured courses:", error);
            throw error;
        }
    },

    createCourse: async (formData) => {
        try {
            const response = await api.post("/courses", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Bắt buộc cho việc upload file
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating course:", error);
            const message = error.response?.data?.message || "Không thể tạo khóa học. Vui lòng thử lại!";
            return { success: false, message };
        }
    },

    getCourseById: async (id) => {
        try {
            const response = await api.get(`/courses/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching course detail:", error);
            throw error;
        }
    },

    updateCourseImage: async (id, imageFile) => {
        try {
            const formData = new FormData();
            formData.append("image", imageFile); // Khớp chuẩn key "image" trong Postman của bạn

            const response = await api.post(`/courses/${id}/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data; // Trả về data chứa link ảnh mới sau khi upload thành công
        } catch (error) {
            const message = error.response?.data?.message || "Không thể tải ảnh lên!";
            return { success: false, message };
        }
    },

    updateCourse: async (id, formdata) => {
        try {
            const response = await api.put(`/courses/${id}`, formdata);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Không thể cập nhật khóa học!";
            return { success: false, message };
        }
    },

    changeCourseStatus: async (id) => {
        try {
            const response = await api.patch(`/courses/${id}/status`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Không thể xóa khóa học!";
            return { success: false, message };
        }
    }

}