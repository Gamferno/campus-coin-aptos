const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk')

// Initialize Aptos client
const aptosConfig = new AptosConfig({ 
  network: Network.DEVNET,
  nodeUrl: process.env.APTOS_NODE_URL 
})
const aptos = new Aptos(aptosConfig)

// Get APT balance for an address
const getBalance = async (req, res) => {
  try {
    const { address } = req.params
    
    const resources = await aptos.getAccountResources({ accountAddress: address })
    
    // Look for the APT coin resource
    const coinResource = resources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    )
    
    let balance = 0
    if (coinResource && coinResource.data) {
      const coinData = coinResource.data
      balance = parseInt(coinData.coin.value) / 100000000 // Convert from Octas to APT
    }
    
    res.json({
      success: true,
      address,
      balance,
      balanceOctas: coinResource ? coinResource.data.coin.value : '0'
    })
  } catch (error) {
    console.error('Error fetching balance:', error)
    
    if (error.message.includes('not found')) {
      // Account doesn't exist yet
      res.json({
        success: true,
        address: req.params.address,
        balance: 0,
        balanceOctas: '0'
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch balance',
        details: error.message
      })
    }
  }
}

// Get transaction history for an address
const getTransactions = async (req, res) => {
  try {
    const { address } = req.params
    const limit = parseInt(req.query.limit) || 25
    const start = req.query.start || undefined
    
    const transactions = await aptos.getAccountTransactions({ 
      accountAddress: address,
      options: {
        limit,
        start
      }
    })
    
    res.json({
      success: true,
      address,
      transactions,
      count: transactions.length
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      details: error.message
    })
  }
}

// Send tokens (this is more of a validation endpoint - actual sending happens on frontend)
const sendTokens = async (req, res) => {
  try {
    const { recipient, amount, sender } = req.body
    
    // Validate the transaction parameters
    if (!recipient || !amount || !sender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: recipient, amount, sender'
      })
    }
    
    // Check sender balance
    const senderResources = await aptos.getAccountResources({ accountAddress: sender })
    const coinResource = senderResources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    )
    
    if (!coinResource) {
      return res.status(400).json({
        success: false,
        error: 'Sender has no APT balance'
      })
    }
    
    const senderBalance = parseInt(coinResource.data.coin.value) / 100000000
    const transferAmount = parseFloat(amount)
    
    if (senderBalance < transferAmount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
        available: senderBalance,
        requested: transferAmount
      })
    }
    
    res.json({
      success: true,
      message: 'Transaction parameters validated',
      sender,
      recipient,
      amount: transferAmount,
      senderBalance
    })
  } catch (error) {
    console.error('Error validating send transaction:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to validate transaction',
      details: error.message
    })
  }
}

// Mint tokens (admin only - this is a mock implementation)
const mintTokens = async (req, res) => {
  try {
    const { recipient, amount, admin } = req.body
    
    // Check if the requester is an admin
    const adminAddresses = (process.env.ADMIN_ADDRESSES || '').split(',').map(addr => addr.trim())
    
    if (!adminAddresses.includes(admin)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Admin privileges required'
      })
    }
    
    // In a real implementation, this would interact with a custom coin contract
    // For now, we'll just validate the parameters and return success
    
    res.json({
      success: true,
      message: 'Mint request validated (mock implementation)',
      admin,
      recipient,
      amount: parseFloat(amount),
      note: 'In a real implementation, this would mint tokens via smart contract'
    })
  } catch (error) {
    console.error('Error processing mint request:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process mint request',
      details: error.message
    })
  }
}

// Check admin status
const checkAdminStatus = async (req, res) => {
  try {
    const { address } = req.params
    const adminAddresses = (process.env.ADMIN_ADDRESSES || '').split(',').map(addr => addr.trim())
    
    const isAdmin = adminAddresses.includes(address) || adminAddresses.includes(address.toLowerCase())
    
    res.json({
      success: true,
      address,
      isAdmin,
      adminAddresses: adminAddresses.length // Don't expose actual admin addresses
    })
  } catch (error) {
    console.error('Error checking admin status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to check admin status',
      details: error.message
    })
  }
}

// Get account info
const getAccountInfo = async (req, res) => {
  try {
    const { address } = req.params
    
    const account = await aptos.getAccountInfo({ accountAddress: address })
    
    res.json({
      success: true,
      account
    })
  } catch (error) {
    console.error('Error fetching account info:', error)
    
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Account not found',
        address
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch account info',
        details: error.message
      })
    }
  }
}

module.exports = {
  getBalance,
  getTransactions,
  sendTokens,
  mintTokens,
  checkAdminStatus,
  getAccountInfo
}