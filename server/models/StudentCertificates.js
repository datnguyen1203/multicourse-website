const mongoose = require('mongoose');

const mongoose = require('mongoose');

const teacherCertificatesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    // Thêm course_id vào đây sau
    certificate_name: {
        type: String,
        required: [true, 'Certificate name is required']
    },
    certificate_url: {
        type: String,
        required: [true, 'Certificate URL is required']
    },
    issue_date: {
        type: Date,
        required: [true, 'Issue date is required']
    }
}, { timestamps: true });

const TeacherCertificates = mongoose.model('TeacherCertificates', teacherCertificatesSchema);
module.exports = TeacherCertificates;


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
