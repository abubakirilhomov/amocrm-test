const amoCRMService = require('../services/amoCRMService');

const createLead = async (req, res) => {
  try {
    const { clientPhone, paymentType, transactionId, amount, clientName, courseTitle } = req.body;
    const lead = await amoCRMService.findLeadByPhone(clientPhone);

    if (lead) {
      const paidStatusId = 142;
      await amoCRMService.updateLeadStatus(lead.id, paidStatusId, { paymentType, transactionId });
      return res.status(200).json({ message: 'Lead updated successfully', lead: lead });
    } else {
      const leadData = {
        name: clientName,
        phone: clientPhone,
        courseTitle: courseTitle,
        amount: amount,
        statusId: 70986170, // Replace with your "Первичный контакт" status ID
        paymentType,
        transactionId
      };

      // Log the payload for debugging
      console.log('Lead data being sent to amoCRM:', JSON.stringify(leadData, null, 2));

      const newLead = await amoCRMService.createNewLead(leadData);

      return res.status(201).json({ message: 'New lead created successfully', lead: newLead });
    }
  } catch (error) {
    console.error('Error creating or updating lead:', error.response ? error.response.data : error.message);
    return res.status(500).json({ message: 'Error creating or updating lead', error: error.message });
  }
};

module.exports = {
  createLead,
};
