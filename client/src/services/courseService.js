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
    }
}