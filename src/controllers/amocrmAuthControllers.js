const amocrmService = require('../services/amocrmServices');

exports.handleAmoCrmCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ message: 'No authorization code provided' });
  }

  console.log('Received Authorization Code:', code)
  
  try {
    const tokenData = await amocrmService.getAccessToken(code);
    res.json({ message: 'Access token received', tokenData });
  } catch (error) {
    res.status(500).json({ message: 'Error during token exchange', error: error.message });
  }
};
