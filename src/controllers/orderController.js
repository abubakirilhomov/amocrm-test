const Order = require("../models/orderModel");
const amocrmService = require("../services/amocrmServices");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("course_id");
    for (const order of orders) {
      await syncOrderWithAmoCRM(order);
    }

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Error getting orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("course_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await syncOrderWithAmoCRM(order);

    res.status(200).json({ data: order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Error getting order", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      transactionId,
      create_time, 
      state,
      amount,
      course_id,
      user_id,
      clientName,
      clientPhone,
      clientAddress,
      invoiceNumber,
      status,
      passport,
      tgUsername,
      courseTitle,
      prefix
    } = req.body;

    const createTimeUnix = new Date(create_time).getTime() / 1000;

    const newOrder = new Order({
      transactionId,
      invoiceNumber,
      create_time: createTimeUnix,
      perform_time: null,
      cancel_time: null,
      state,
      amount,
      course_id,
      user_id,
      clientName,
      clientPhone,
      clientAddress,
      passport,
      tgUsername,
      prefix,
      courseTitle,
      reason: null,
      status: status || 'НЕ ОПЛАЧЕНО'
    });

    await newOrder.save();

    await syncOrderWithAmoCRM(newOrder);

    res.status(201).json({ message: "Order created", data: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createOrUpdateContact = async (order, accessToken) => {
  try {
    // Search for existing contact by phone
    const contacts = await amocrmService.findContactByPhone(order.clientPhone, accessToken);

    let contactId;
    if (contacts.length > 0) {
      // If contact exists, update it
      contactId = contacts[0].id;
      const updatedContactData = {
        id: contactId,
        "name": order.clientName,
        "custom_fields_values": [
          {
            field_id: "phone_field_id", // Replace with actual phone field ID
            values: [{ value: order.clientPhone }]
          },
          {
            field_id: "email_field_id", // Replace with actual email field ID if needed
            values: [{ value: order.clientEmail || 'нет email' }]
          }
        ]
      };
      await amocrmService.updateContact(contactId, updatedContactData, accessToken);
      console.log(`Контакт с номером телефона ${order.clientPhone} обновлен.`);
    } else {
      // If contact does not exist, create it
      const newContactData = {
        "name": order.clientName,
        "custom_fields_values": [
          {
            field_id: "phone_field_id", // Replace with actual phone field ID
            values: [{ value: order.clientPhone }]
          },
          {
            field_id: "email_field_id", // Replace with actual email field ID if needed
            values: [{ value: order.clientEmail || 'нет email' }]
          }
        ]
      };
      const createdContact = await amocrmService.createContact(newContactData, accessToken);
      contactId = createdContact.id;
      console.log(`Создан новый контакт с номером телефона ${order.clientPhone}.`);
    }

    return contactId;
  } catch (error) {
    console.error(`Ошибка при обработке контакта с телефоном ${order.clientPhone}:`, error.message);
  }
};

const syncOrderWithAmoCRM = async (order) => {
  try {
    const accessToken = await amocrmService.getAccessToken(); // Fetch token from service or refresh if needed
    const contactId = await createOrUpdateContact(order, accessToken); // Ensure contact exists

    const phone = order.clientPhone;
    const deals = await amocrmService.findDealByPhone(phone, accessToken);

    if (deals.length > 0) {
      const dealId = deals[0].id;
      const updatedDealData = {
        id: dealId,
        "name": order.clientName,
        "contacts_id": [contactId], // Attach the contact by ID
        "custom_fields_values": [
          {
            field_id: "1234567",  
            values: [{ value: order.clientPhone }]
          },
          {
            field_id:"23456789",  
            values: [{ value: order.courseTitle }]
          },
          {
            field_id: "9876543", 
            values: [{ value: order.amount }]
          },
          {
            field_id: "8765432", 
            values: [{ value: order.status }]
          }
        ]
      };

      await amocrmService.updateDeal(dealId, updatedDealData, accessToken);
      console.log(`Сделка с номером телефона ${phone} обновлена.`);
    } else {
      const newDealData = { 
        "name": order.clientName,
        "contacts_id": [contactId], // Attach the contact by ID
        "custom_fields_values": [
          {
            field_id: "1234567",  
            values: [{ value: order.clientPhone }]
          },
          {
            field_id:"23456789",  
            values: [{ value: order.courseTitle }]
          },
          {
            field_id: "9876543", 
            values: [{ value: order.amount }]
          },
          {
            field_id: "8765432", 
            values: [{ value: order.status }]
          }
        ]
      };
      
      console.log('Создание новой сделки:', newDealData);
      await amocrmService.createDeal([newDealData], accessToken);
      console.log(`Создана новая сделка с номером телефона ${phone}.`);
    }
  } catch (error) {
    console.error(`Ошибка при синхронизации заказа с телефоном ${order.clientPhone}:`, error.message);
    // Optionally, trigger retries or notify users/admins
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
};
