const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchemma = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 1,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const CourseSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    average_rating: {
        type: Number,
        default: 0,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: false,
    },
    comments: [CommentsSchemma],
});

module.exports = mongoose.model("Courses", CourseSchema);
