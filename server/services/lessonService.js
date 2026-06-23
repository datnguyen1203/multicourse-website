const Lessons = require("../models/Lessons");
const { deleteFolderFromCloudinary } = require("../utils/cloudinaryHelper");

module.exports = {

    // Get all lessons of a course
    async getLessonsByCourse(courseId) {
        try {
            const lessons = await Lessons.find({ course: courseId });
            return lessons;
        } catch (error) {
            throw new Error('Error fetching lessons for the course: ' + error.message);
        }
    },

    // Get lesson by ID
    async getLessonById(lessonId) {
        try {
            const lesson = await Lessons.findById(lessonId);
            if (!lesson) {
                throw new Error('Lesson not found');
            }
            return lesson;
        } catch (error) {
            throw new Error('Error fetching lesson: ' + error.message);
        }
    },

    // Create a new lesson
    async createLesson(lessonData) {
        try {
            const newLesson = new Lessons(lessonData);
            await newLesson.save();
            return newLesson;
        } catch (error) {
            throw new Error('Error creating lesson: ' + error.message);
        }
    },

    // Update an existing lesson
    async updateLesson(lessonId, lessonData) {
        try {
            const updatedLesson = await Lessons.findByIdAndUpdate(lessonId, lessonData, { new: true });
            if (!updatedLesson) {
                throw new Error('Lesson not found');
            }
            return updatedLesson;
        } catch (error) {
            throw new Error('Error updating lesson: ' + error.message);
        }
    },

    // Delete a lesson
    async deleteLesson(lessonId) {
        try {
            const lesson = await Lessons.findById(lessonId);
            if (!lesson) {
                throw new Error('Lesson not found');
            }

            const lessonFolderPath = `multicourse/courses/${lesson.course_id}/lesson/${lesson.number}`;
            await deleteFolderFromCloudinary(lessonFolderPath);

            const deletedLesson = await Lessons.findByIdAndDelete(lessonId);
            return deletedLesson;
        } catch (error) {
            throw new Error('Error deleting lesson: ' + error.message);
        }
    },

    //change status of a lesson
    async changeLessonStatus(lessonId, status) {
        try {
            const updatedLesson = await Lessons.findByIdAndUpdate(lessonId, { status: status }, { new: true });
            if (!updatedLesson) {
                throw new Error('Lesson not found');
            }
            return updatedLesson;
        } catch (error) {
            throw new Error('Error changing lesson status: ' + error.message);
        }
    },

};


