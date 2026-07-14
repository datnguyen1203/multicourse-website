import api from "./api";

export const lessonService = {

    createLesson: async (formData) => {
        try {
            const response = await api.post("/lessons", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Không thể tạo bài học!";
            return { success: false, message };
        }
    },

    getLessonsByCourseId: async (courseId) => {
        try {
            const response = await api.get(`/lessons/course/${courseId}`);
            return response.data; // Trả về mảng danh sách bài học
        } catch (error) {
            console.error("Error fetching lessons:", error);
            return [];
        }
    }
};