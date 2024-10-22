const axios = require('axios');
const accessToken = process.env.AMOCRM_ACCESS_TOKEN;
const subdomain = process.env.AMOCRM_SUBDOMAIN;

const findLeadByPhone = async (phoneNumber) => {
  try {
    const response = await axios.get(
      `https://${subdomain}.amocrm.ru/api/v4/leads`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: { query: phoneNumber }
      }
    );
    return response.data._embedded ? response.data._embedded.leads[0] : null;
  } catch (error) {
    console.error('Error searching for lead:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Update lead status
const updateLeadStatus = async (leadId, statusId, paymentData) => {
  try {
    const response = await axios.patch(
      `https://${subdomain}.amocrm.ru/api/v4/leads/${leadId}`,
      [
        {
          id: leadId,
          status_id: statusId,
          custom_fields_values: [
            {
              field_id: 'CORRECT_PAYMENT_TYPE_FIELD_ID', // Replace with your correct field ID
              values: [{ value: paymentData.paymentType }]
            },
            {
              field_id: 'CORRECT_TRANSACTION_ID_FIELD_ID', // Replace with your correct field ID
              values: [{ value: paymentData.transactionId }]
            }
          ]
        }
      ],
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating lead:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const createNewLead = async (leadData) => {
  try {
    const payload = [{
        name: leadData.name,
        price: leadData.amount,
        status_id: leadData.statusId, // This must be a valid status ID
        custom_fields_values: [
          {
            field_id: '67890123', // Correct field ID for phone number
            values: [{ value: leadData.phone }]
          },
          {
            field_id: '2345678', // Correct field ID for course title
            values: [{ value: leadData.courseTitle }]
          },
          {
            field_id: '3456789', // Correct field ID for payment type
            values: [{ value: leadData.paymentType }]
          },
          {
            field_id: '4567890', // Correct field ID for transaction ID
            values: [{ value: leadData.transactionId }]
          }
        ]
      }];
    
    console.log("Payload being sent to amoCRM:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `https://${subdomain}.amocrm.ru/api/v4/leads`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating new lead:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { findLeadByPhone, updateLeadStatus, createNewLead };
