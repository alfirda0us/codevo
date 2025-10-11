// server.js (Node.js/Express example)
const express = require('express');
const app = express();

app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await courseDB.getCourseById(req.params.id);
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/enroll', async (req, res) => {
    // Add authentication and validation here
    const { userId, courseId } = req.body;
    try {
        const result = await courseDB.enrollUser(userId, courseId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});