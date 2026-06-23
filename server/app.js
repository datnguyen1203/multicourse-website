var express = require('express');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const courseRouter = require('./routes/courseRouter');
const lessonRouter = require('./routes/lessonRouter');

var app = express();

const dbConfig = require("./configs/db_config");

app.connect = dbConfig;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({ message: "Not Found" });
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
