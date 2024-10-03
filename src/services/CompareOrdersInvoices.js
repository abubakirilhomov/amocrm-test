const Invoice = require('../models/invoiceModel');
const Order = require('../models/orderModel');

const compareOrdersAndInvoices = async () => {
  try {
    const invoices = await Invoice.find();
    const orders = await Order.find();

    const ordersMap = new Map();
    orders.forEach(order => {
      if (order.invoiceNumber) {
        ordersMap.set(order.invoiceNumber, order);
      }
    });

    const comparedResults = invoices.map(invoice => {
      const matchingOrder = ordersMap.get(invoice.invoiceNumber) || null;
      return {
        invoice,
        matchingOrder,
      };
    });

    return comparedResults;
  } catch (error) {
    console.error("Error comparing orders and invoices:", error);
    throw new Error("Error comparing orders and invoices");
  }
};

module.exports = compareOrdersAndInvoices;
