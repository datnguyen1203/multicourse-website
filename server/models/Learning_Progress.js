const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LearningProgressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    lessons_progress: [
        {
            lesson: {
                type: Schema.Types.ObjectId,
                ref: "Lessons",
                required: true,
            }, status: {
                type: String,
                default: "Not Started",
                enum: ["In Progress", "Completed", "Not Started"],
            },
            note: {
                type: String,
                default: "",
            },
            progress_time: {
                type: Number,
                default: 0,
            },
        },
    ],
    final_exam: {
        status: {
            type: String,
            default: "Not Started",
            enum: ["In Progress", "Completed", "Not Started"],
        },
        score: {
            type: Number,
            default: 0,
        },
    },
    final_status: {
        type: String,
        default: "In Progress",
        enum: ["In Progress", "Completed", "Not Started"],
    },
    enrollment_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("LearningProgress", LearningProgressSchema);
