const express = require('express')
const router = express.Router()
const aptosController = require('../controllers/aptosController')
const { validateAddress, validateAmount } = require('../middleware/validation')

// Get balance for an address
router.get('/balance/:address', validateAddress, aptosController.getBalance)

// Get transaction history for an address
router.get('/transactions/:address', validateAddress, aptosController.getTransactions)

// Send tokens (requires wallet signature on frontend)
router.post('/send', validateAddress, validateAmount, aptosController.sendTokens)

// Mint tokens (admin only)
router.post('/mint', validateAddress, validateAmount, aptosController.mintTokens)

// Check admin status
router.get('/admin/:address', validateAddress, aptosController.checkAdminStatus)

// Get account info
router.get('/account/:address', validateAddress, aptosController.getAccountInfo)

module.exports = router