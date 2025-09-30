// Validate Aptos address format
const validateAddress = (req, res, next) => {
  const address = req.params.address || req.body.recipient || req.body.sender || req.body.admin
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Address is required'
    })
  }
  
  // Basic Aptos address validation (starts with 0x and has valid hex characters)
  const addressRegex = /^0x[a-fA-F0-9]{1,64}$/
  
  if (!addressRegex.test(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Aptos address format',
      provided: address,
      expected: '0x followed by 1-64 hexadecimal characters'
    })
  }
  
  next()
}

// Validate amount format
const validateAmount = (req, res, next) => {
  const amount = req.body.amount
  
  if (amount === undefined || amount === null) {
    return res.status(400).json({
      success: false,
      error: 'Amount is required'
    })
  }
  
  const numAmount = parseFloat(amount)
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Amount must be a positive number',
      provided: amount
    })
  }
  
  if (numAmount > 1000000) {
    return res.status(400).json({
      success: false,
      error: 'Amount too large (max: 1,000,000 APT)',
      provided: amount
    })
  }
  
  next()
}

// Rate limiting middleware (simple implementation)
const rateLimit = (windowMs = 60000, maxRequests = 100) => {
  const requests = new Map()
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs })
      return next()
    }
    
    const requestData = requests.get(ip)
    
    if (now > requestData.resetTime) {
      requestData.count = 1
      requestData.resetTime = now + windowMs
      return next()
    }
    
    if (requestData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        resetTime: new Date(requestData.resetTime).toISOString()
      })
    }
    
    requestData.count++
    next()
  }
}

module.exports = {
  validateAddress,
  validateAmount,
  rateLimit
}