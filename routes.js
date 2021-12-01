'use strict'

const express = require('express');
const authenticateUser = require('./middleware/auth-user');
const asyncHandler = require('./middleware/async-handler');
const { User, Course } = require('./models');
const router = express.Router();

// Create GET route for users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200);
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailaddress: user.emailAddress
    });
}));

// POST route for users
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').json();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// GET route for courses
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: [
            'id',
            'title', 
            'description', 
            'estimatedTime', 
            'materialsNeeded',
            'userId'
        ],
        include: [{
            model: User,
            as: 'user',
        }],
    });
    res.status(200);
    res.json(courses);
}))

// route for courses by id, also return the user
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findOne({ 
        attributes: [
            'id',
            'title', 
            'description', 
            'estimatedTime', 
            'materialsNeeded',
            'userId'
        ],
        where: { id: req.params.id },
        include: [{
            model: User,
            as: 'user',
        }],
    });
    if (course) {
        res.status(200);
        res.json(course);
    } else {
        res.status(200);
        res.json({
            message: 'Unable to find user for id: ' + req.params.id
        });
    }
}));

// POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            userId: user.id,
        });
        res.status(201).location(`/courses/${course.id}`).json();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
      }
}));


// PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        const id = req.params.id;
        const course = await Course.findByPk(id);

        if(course) {
            if(course.userId === user.id) {
                if (!req.body.title) {
                    req.body.title = '';
                }
                if (!req.body.description) {
                    req.body.description = '';
                }
                await Course.update(req.body, {
                    where: {
                        id: id,
                    },
                });
                res.status(204).json();
            } else {
                res.status(403).json({
                    message: 'Access Denied: Only course owner may update course.'
                });
                error.name = 'AccessError';
		        throw error;
            }
        } else {
            res.status(403).json({
                message: 'Course does not exist'
            });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);
    if(course) {
        if(course.userId === user.id) {
            course.destroy(course);
            res.status(204).json();
        } else {
            res.status(401).json({
                message: 'Permission denied.'
            });
        }
    } else {
        res.status(403).json({
            message: 'Unable to delete a course that does not exist'
        });
    }
}));

module.exports = router;