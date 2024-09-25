const express = require('express');
const { getCourses, createCourse, deleteCourse } = require('../controllers/courseController');
const router = express.Router();

router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.delete('/courses/:id', deleteCourse)

module.exports = router;
