const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');

router.post('/signup-to-waitlist', waitlistController.signupToWaitlist);

module.exports = router;