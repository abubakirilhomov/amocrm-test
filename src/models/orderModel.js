const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: false
  },
  invoiceNumber: {
    type: String,
    required: false
  },
  create_time: {
    type: Date,  // Changed to Date
    required: false
  },
  perform_time: {
    type: Date  // Changed to Date
  },
  cancel_time: {
    type: Date  // Changed to Date
  },
  state: {
    type: String,  // Changed to String for states like "Paid", "Pending"
    enum: ['Paid', 'Pending', 'Cancelled'],  // Assuming possible values for state
    required: false
  },
  amount: {
    type: Number,
    required: false
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  courseTitle: {
    type: String,
    required: false
  },
  clientName: {
    type: String,
    required: false
  },
  clientPhone: {
    type: String,
    required: false
  },
  clientAddress: {
    type: String,
    required: false
  },
  tgUsername: {
    type: String,
    required: false
  },
  passport: {
    type: String,
    required: false
  },
  reason: {
    type: String,  // Changed to String
    required: false
  },
  status: {
    type: String,
    enum: ['НЕ ОПЛАЧЕНО', 'ВЫСТАВЛЕНО', 'ОПЛАЧЕНО', 'ОТМЕНЕНО'],
    default: 'НЕ ОПЛАЧЕНО'
  },
  paymentType: {
    type: String,
    enum: ["Payme", "Click", "Uzum"]
  }
});

module.exports = mongoose.model('Orders', orderSchema);