const CourseService = require('../services/courseService');

const courseController = {
    //get top 3 courses
    async getTop3Courses(req, res) {
        try {
            const courses = await CourseService.getTop3Courses();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active courses' });
        }
    },

    //get active courses
    async getActiveCourses(req, res) {
        try {
            const courses = await CourseService.getAllActiveCourses();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active courses' });
        }
    },

    //get all courses
    async getAllCourses(req, res) {
        try {
            const courses = await CourseService.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    },

    //get all courses of a teacher
    async getCoursesByTeacher(req, res) {
        try {
            const teacherId = req.user._id; // Assuming teacher's ID is stored in req.user
            const courses = await CourseService.getCoursesByTeacher(teacherId);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses for the teacher' });
        }
    },

    //get course by id
    async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const course = await CourseService.getCourseById(courseId);
            if (course) {
                res.status(200).json(course);
            } else {
                res.status(404).json({ error: 'Course not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch course' });
        }
    },

    //create a new course
    async createCourse(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const courseData = req.body;
            courseData.image = req.file.path; // Add the image path to the course data
            const newCourse = await CourseService.createCourse(courseData);
            res.status(201).json(newCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create course' });
        }
    },

    //update course by id
    async updateCourse(req, res) {
        try {
            const courseId = req.params.id;
            const courseData = req.body;
            const updatedCourse = await CourseService.updateCourse(courseId, courseData);
            if (updatedCourse) {
                res.status(200).json(updatedCourse);
            } else {
                res.status(404).json({ error: 'Course not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update course' });
        }
    },

    //change course status
    async changeCourseStatus(req, res) {
        try {
            const courseId = req.params.id;
            const { status } = req.body;
            const updatedCourse = await CourseService.changeCourseStatus(courseId, status);
            if (updatedCourse) {
                res.status(200).json(updatedCourse);
            }
            else {
                res.status(404).json({ error: 'Course not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to change course status' });
        }
    },

    // Upload/Update course image
    async uploadCourseImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const courseId = req.params.id;
            const fileUrl = req.file.path;

            const course = await CourseService.uploadCourseImage(courseId, fileUrl);
            res.status(200).json({
                message: 'Course image uploaded successfully',
                course
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = courseController;