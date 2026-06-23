const LessonController = require("../controllers/lessonController");
const { uploadLesson } = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizationMiddleware = require("../middlewares/authorizationMiddleware");
const express = require("express");
const router = express.Router();

// Get all lessons of a course
router.get("/course/:courseId", authMiddleware, LessonController.getLessonsByCourse);

// Get lesson by ID
router.get("/:lessonId", authMiddleware, LessonController.getLessonById);

// Create a new lesson
router.post("/",
    authMiddleware,
    authorizationMiddleware("teacher"),
    uploadLesson.fields([
        { name: "video", maxCount: 1 },
        { name: "document", maxCount: 1 }
    ]),
    LessonController.createLesson);

// Update an existing lesson
router.put("/:lessonId", authMiddleware, authorizationMiddleware("teacher"), uploadLesson.fields([
    { name: "video", maxCount: 1 },
    { name: "document", maxCount: 1 }
]), LessonController.updateLesson);

// Delete a lesson
router.delete("/:lessonId", authMiddleware, authorizationMiddleware("teacher"), LessonController.deleteLesson);

// Change lesson status
router.patch("/:lessonId/status", authMiddleware, authorizationMiddleware("teacher"), LessonController.changeLessonStatus);

module.exports = router;