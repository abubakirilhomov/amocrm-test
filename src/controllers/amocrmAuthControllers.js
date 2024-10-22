const amocrmService = require('../services/amocrmService');

exports.handleAmoCrmCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ message: 'No authorization code provided' });
  }

  try {
    // Обмен кода авторизации на access_token
    const tokenData = await amocrmService.getAccessToken(code);
    // Здесь вы можете сохранить токены в базе данных или передать их клиенту
    res.json({ message: 'Access token received', tokenData });
  } catch (error) {
    res.status(500).json({ message: 'Error during token exchange', error: error.message });
  }
};
