const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// Verify wallet signature (for future authentication features)
router.post('/verify', authController.verifySignature)

// Get user profile/permissions
router.get('/profile/:address', authController.getUserProfile)

module.exports = router