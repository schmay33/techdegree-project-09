'use strict'

const express = require('express');
const authenticateUser = require('./middleware/auth-user');

const router = express.Router();

// handler function for the routes
function asyncHandler(callback) {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            // pass errors to the global error handler
            next(error);
        }
    }
}

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