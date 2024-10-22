const axios = require('axios');
require('dotenv').config();

const amocrmService = {
  // Получение access_token с помощью кода авторизации
  getAccessToken: async (code) => {
    try {
      const response = await axios.post(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`, {
        client_id: process.env.AMOCRM_CLIENT_ID,
        client_secret: process.env.AMOCRM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.AMOCRM_REDIRECT_URI,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting access token:', error.response ? error.response.data : error.message);
      throw new Error('Failed to get access token');
    }
  },

  // Обновление access_token
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`, {
        client_id: process.env.AMOCRM_CLIENT_ID,
        client_secret: process.env.AMOCRM_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: process.env.AMOCRM_REDIRECT_URI,
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error.response ? error.response.data : error.message);
      throw new Error('Failed to refresh token');
    }
  },
};

module.exports = amocrmService;
