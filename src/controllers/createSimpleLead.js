const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json()); // To handle JSON body parsing

const accessToken = process.env.AMOCRM_ACCESS_TOKEN;
const subdomain = process.env.AMOCRM_SUBDOMAIN;

// API to dynamically create leads in amoCRM
app.post('/create-lead', async (req, res) => {
  try {
    // Extract lead data from the request body
    const { name, price, phone, courseTitle, statusId } = req.body;

    // Validate input data (optional, but recommended)
    if (!name || !price || !phone || !courseTitle || !statusId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prepare the payload for amoCRM API
    const payload = [
      {
        name: name, // Dynamic lead name
        price: price, // Dynamic price
        status_id: statusId, // Dynamic status ID (should be valid in amoCRM)
        custom_fields_values: [
          {
            field_id: '1234567', // Replace with actual field ID for phone number
            values: [{ value: phone }]
          },
          {
            field_id: '2345678', // Replace with actual field ID for course title
            values: [{ value: courseTitle }]
          }
        ]
      }
    ];

    // Log the payload for debugging purposes
    console.log("Payload being sent to amoCRM:", JSON.stringify(payload, null, 2));

    // Send the request to create the lead in amoCRM
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

    // Respond with the created lead data
    res.status(201).json({
      message: 'Lead created successfully',
      lead: response.data
    });
  } catch (error) {
    // Handle errors
    console.error('Error creating lead in amoCRM:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Error creating lead in amoCRM',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});