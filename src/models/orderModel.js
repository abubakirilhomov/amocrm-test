const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: false 
  },
  create_time: {
    type: Number,
    required: true
  },
  perform_time: {
    type: Number
  },
  cancel_time: {
    type: Number
  },
  state: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
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
  reason: {
    type: Number
  },
  status: {
    type: String,
    enum: ['НЕ ОПЛАЧЕНО', 'ОПЛАЧЕНО', 'ОТМЕНЕНО'],
    default: 'НЕ ОПЛАЧЕНО'
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
