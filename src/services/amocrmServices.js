const axios = require('axios');

// Найти сделку по телефону
const findDealByPhone = async (phone, accessToken) => {
  try {
    const response = await axios.get(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'application/json'
      },
      params: {
        query: phone
      }
    });

    console.log('Результат поиска сделок:', JSON.stringify(response.data, null, 2));

    return response.data._embedded ? response.data._embedded.leads : [];
  } catch (error) {
    console.error('Error searching for deal:', error.response ? error.response.data : error.message);
    throw new Error('Failed to search for deal by phone');
  }
};  

// Обновить сделку
const updateDeal = async (dealId, dealData, accessToken) => {
  try {
    const response = await axios.patch(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads/${dealId}`, dealData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating deal:', error.response ? error.response.data : error.message);
    throw new Error('Failed to update deal');
  }
};

// Создать новую сделку
const createDeal = async (dealData, accessToken) => {
  try {
    console.log('Создание сделки с данными:', dealData);

    const response = await axios.post(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads`, dealData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating deal:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create deal');
  }
};

// Найти контакт по телефону
const findContactByPhone = async (phone, accessToken) => {
  try {
    const response = await axios.get(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/contacts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'application/json'
      },
      params: {
        query: phone
      }
    });

    return response.data._embedded ? response.data._embedded.contacts : [];
  } catch (error) {
    console.error('Error searching for contact:', error.response ? error.response.data : error.message);
    throw new Error('Failed to search for contact by phone');
  }
};

// Обновить контакт
const updateContact = async (contactId, contactData, accessToken) => {
  try {
    const response = await axios.patch(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/contacts/${contactId}`, contactData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating contact:', error.response ? error.response.data : error.message);
    throw new Error('Failed to update contact');
  }
};

// Создать контакт
const createContact = async (contactData, accessToken) => {
  try {
    const response = await axios.post(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/contacts`, contactData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create contact');
  }
};

// Получить access token по authorization code
const getAccessToken = async (code) => {
    try {
      const response = await axios.post(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`, {
        "client_id": process.env.AMOCRM_CLIENT_ID,
        "client_secret": process.env.AMOCRM_CLIENT_SECRET,
        "grant_type": 'authorization_code',
        "code": code,
        "redirect_uri": process.env.AMOCRM_REDIRECT_URI
      });
      console.log("code", code)
      console.log('Token data:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Error getting access token:', error.response ? error.response.data : error.message);
      throw new Error('Failed to get access token');
    }
};

// Обновить access token по refresh token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`https://${process.env.AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`, {
      client_id: process.env.AMOCRM_CLIENT_ID,
      client_secret: process.env.AMOCRM_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      redirect_uri: process.env.AMOCRM_REDIRECT_URI
    });

    console.log('New Token data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to refresh access token');
  }
};

module.exports = {
  refreshAccessToken,
  getAccessToken,
  findDealByPhone,
  findContactByPhone,
  updateContact,
  createContact,
  updateDeal,
  createDeal
};
