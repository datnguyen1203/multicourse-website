const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloundinary");
const CourseService = require("../services/courseService");

// cấu hình storage
const storage = (folder_path) => new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folder_path,
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mkv", "avi", "webm", "pdf", "doc", "docx"],
        resource_type: "auto",
        quality: "auto"
    },
});


const uploadAvatar = multer({
    storage: storage("multicourse/avatars"),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
        }
    }
});

const uploadCourseImage = multer({
    storage: storage("multicourse/courses"),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
        }
    }
});

// Dynamic storage cho lesson với folder: courses/<course_title>/lesson/<lesson_number>
const dynamicLessonStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        const courseId = req.body.course_id || "unknown";
        const lessonNumber = req.body.number || "0";

        console.log("Received course_id:", courseId);

        const folderPath = `multicourse/courses/${courseId}/lesson/${lessonNumber}`;

        return {
            folder: folderPath,
            allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mkv", "avi", "webm", "pdf", "doc", "docx"],
            resource_type: "auto",
            quality: "auto"
        };
    }
});

const uploadLesson = multer({
    storage: dynamicLessonStorage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for video, 20MB for document
    },
    fileFilter: (req, file, cb) => {
        const videoMimes = ['video/mp4', 'video/mkv', 'video/avi', 'video/webm'];
        const documentMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const allowedMimes = [...videoMimes, ...documentMimes];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only video (mp4, mkv, avi, webm) and document (pdf, doc, docx) files are allowed'));
        }
    }
});

module.exports = { uploadAvatar, uploadCourseImage, uploadLesson };