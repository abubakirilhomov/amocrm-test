const amocrmService = require('../services/amocrmServices');

exports.handleAmoCrmCallback = async (req, res) => {
    const code = req.query.code;  // Получаем код авторизации из query параметра

    if (!code) {
      console.log('Authorization code not provided');
      return res.status(400).json({ message: 'No authorization code provided' });
    }

    console.log('Получен код авторизации:', code);

    try {
      // Используем код авторизации для получения токенов
      const tokenData = await amocrmService.getAccessToken(code);

      if (!tokenData || !tokenData.access_token) {
        console.error('Access token not received');
        return res.status(500).json({ message: 'Failed to receive access token' });
      }

      // Логируем полученные токены
      console.log('Access token получен:', tokenData.access_token);
      console.log('Refresh token получен:', tokenData.refresh_token);

      // Возвращаем успешный ответ с токенами
      res.json({
        message: 'Access token and refresh token received successfully',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      });
    } catch (error) {
      console.error('Error during token exchange:', error.message);
      res.status(500).json({
        message: 'Error during token exchange',
        error: error.message
      });
    }
  };
