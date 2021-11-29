'use strict'

const express = require('express');
const authenticateUser = require('./middleware/auth-user');
const asyncHandler = require('./middleware/async-handler');

const router = express.Router();

// TODO: Create GET route for users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailaddress: user.emailaddress
    });
}));

// TODO: Create POST route for users
/* router.post('/users', asyncHandler(async (req, res) => {
    
})); */

module.exports = router;