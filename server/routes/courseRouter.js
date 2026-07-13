const authMiddleware = require('../middlewares/authMiddleware');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const CourseController = require('../controllers/courseController');
const express = require('express');
const router = express.Router();

// Get top 3 courses (no authentication required)
router.get('/top3', CourseController.getTop3Courses);

// Get active courses (no authentication required)
router.get('/active', CourseController.getActiveCourses);

// Get all courses (requires authentication)
router.get('/', authMiddleware, authorizationMiddleware('admin'), CourseController.getAllCourses);

// Get all courses of a teacher (requires authentication)
router.get('/teacher', authMiddleware, authorizationMiddleware('teacher'), CourseController.getCoursesByTeacher);

// Get course by ID (requires authentication)
router.get('/:id', authMiddleware, CourseController.getCourseById);

// Create a new course (requires authentication)
router.post('/', authMiddleware, authorizationMiddleware('teacher'), uploadMiddleware.uploadCourseImage.single('image'), CourseController.createCourse);

// Update course by ID (requires authentication)
router.put('/:id', authMiddleware, authorizationMiddleware('teacher'), CourseController.updateCourse);

//Change course status (requires authentication)
router.patch('/:id/status', authMiddleware, authorizationMiddleware('teacher'), CourseController.changeCourseStatus);

// Upload course image (requires authentication)
router.post('/:id/image', authMiddleware, authorizationMiddleware('teacher'), uploadMiddleware.uploadCourseImage.single('image'), CourseController.uploadCourseImage);

module.exports = router;