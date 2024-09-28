const express = require('express')
const router = express.Router()
const Course = require('../models/courseModel')

router.post('/check-course', (req, res) => {
    const { title, route, price } = req.body

    Course.findOne({ title, route, price })
       .then(course => {
            if (course) {
                res.status(200).json({ message: true })
            } else {
                res.status(404).json({ message: false })
            }
        })
       .catch(error => res.status(500).json({ message: error.message }))
})

module.exports = router