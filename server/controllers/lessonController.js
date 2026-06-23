const LessonService = require("../services/lessonService");

const lessonController = {

    // Get all lessons of a course
    async getLessonsByCourse(req, res) {
        try {
            const courseId = req.params.courseId;
            const lessons = await LessonService.getLessonsByCourse(courseId);
            res.status(200).json(lessons);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get lesson by ID
    async getLessonById(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const lesson = await LessonService.getLessonById(lessonId);
            res.status(200).json(lesson);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new lesson
    async createLesson(req, res) {
        try {
            const lessonData = { ...req.body };

            lessonData.course_id = lessonData.course_id || lessonData.courseId;
            lessonData.video_url = req.files?.video?.[0]?.path;
            lessonData.document_url = req.files?.document?.[0]?.path;

            if (!lessonData.course_id || !lessonData.number || !lessonData.title || !lessonData.description || !lessonData.video_url || !lessonData.document_url) {
                return res.status(400).json({
                    message: 'Missing required lesson data'
                });
            }

            const newLesson = await LessonService.createLesson(lessonData);
            res.status(201).json(newLesson);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update an existing lesson
    async updateLesson(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const lessonData = req.body;
            const updatedLesson = await LessonService.updateLesson(lessonId, lessonData);
            res.status(200).json(updatedLesson);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a lesson
    async deleteLesson(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const deletedLesson = await LessonService.deleteLesson(lessonId);
            res.status(200).json({ message: 'Lesson deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Change status of a lesson
    async changeLessonStatus(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const { status } = req.body;
            const updatedLesson = await LessonService.updateLesson(lessonId, { status });
            res.status(200).json(updatedLesson);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = lessonController;