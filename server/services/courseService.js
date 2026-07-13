const { uploadCourseImage } = require('../middlewares/uploadMiddleware');
const Courses = require('../models/Courses');

module.exports = {

    //Get top 3 active courses
    async getTop3Courses() {
        try {
            const courses = await Courses.find({ status: true })
                .limit(3);
            return courses;
        } catch (error) {
            throw new Error('Error fetching courses: ' + error.message);
        }
    },

    // Get all active courses
    async getAllActiveCourses() {
        try {
            const courses = await Courses.find({ status: true });
            return courses;
        } catch (error) {
            throw new Error('Error fetching courses: ' + error.message);
        }
    },

    // Get all courses (including inactive)
    async getAllCourses() {
        try {
            const courses = await Courses.find();
            return courses;
        } catch (error) {
            throw new Error('Error fetching courses: ' + error.message);
        }
    },

    // Get all courses of a teacher
    async getCoursesByTeacher(teacherId) {
        try {
            const courses = await Courses.find({ teacher: teacherId });
            return courses;
        } catch (error) {
            throw new Error('Error fetching courses for the teacher: ' + error.message);
        }
    },

    // Get course by ID
    async getCourseById(courseId) {
        try {
            const course = await Courses.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        } catch (error) {
            throw new Error('Error fetching course: ' + error.message);
        }
    },

    // Create a new course
    async createCourse(courseData) {
        try {
            const newCourse = new Courses(courseData);
            await newCourse.save();
            return newCourse;
        } catch (error) {
            throw new Error('Error creating course: ' + error.message);
        }
    },

    // Update an existing course
    async updateCourse(courseId, courseData) {
        try {
            const updatedCourse = await Courses.findByIdAndUpdate(courseId, courseData, { new: true });
            if (!updatedCourse) {
                throw new Error('Course not found');
            }
            return updatedCourse;
        } catch (error) {
            throw new Error('Error updating course: ' + error.message);
        }
    },

    // Change course status (activate/deactivate)
    async changeCourseStatus(courseId, status) {
        try {
            const updatedCourse = await Courses.findByIdAndUpdate(courseId, { status }, { new: true });
            if (!updatedCourse) {
                throw new Error('Course not found');
            }
            return updatedCourse;
        } catch (error) {
            throw new Error('Error changing course status: ' + error.message);
        }
    },

    // Upload/Update course image
    async uploadCourseImage(courseId, fileUrl) {
        try {
            // Get current course to check if image already exists
            const currentCourse = await Courses.findById(courseId);
            if (!currentCourse) {
                throw new Error('Course not found');
            }

            // Delete old image from Cloudinary if it exists
            // Skip default image (from res-console.cloudinary.com)
            if (currentCourse.image_url && !currentCourse.image_url.includes('res-console')) {
                await deleteAvatarFromCloudinary(currentCourse.image_url);
            }

            // Update course with new image URL
            const updatedCourse = await Courses.findByIdAndUpdate(
                courseId,
                { image: fileUrl },
                { returnDocument: 'after' }
            );

            return updatedCourse;
        } catch (error) {
            throw new Error('Error uploading course image: ' + error.message);
        }
    }
}