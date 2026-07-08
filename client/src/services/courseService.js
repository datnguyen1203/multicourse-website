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
}