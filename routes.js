'use strict'

const express = require('express');
const authenticateUser = require('./middleware/auth-user');
const asyncHandler = require('./middleware/async-handler');
const { User, Course } = require('./models');
const router = express.Router();
const bcrypt = require('bcryptjs');
const user = require('./models/user');

// Create GET route for users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200);//.json({ "message": "Account successfully created!" });
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailaddress: user.emailAddress
    });
}));

// POST route for users
router.post('/users', asyncHandler(async (req, res) => {
    try {
        // If we wanted to hash the password
        //const user = User.build(req.body);
        //user.password = bcrypt.hashSync(user.password);
        await User.create(req.body);
        res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

// GET route for courses
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
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

// TODO: POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.



// TODO: PUT route that will update the corresponding course and return a 204 HTTP status code and no content.

// TODO: DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.

module.exports = router;