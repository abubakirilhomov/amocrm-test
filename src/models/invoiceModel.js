const mongoose = require('mongoose');
const counterModel = require('./counterModel');

const invoiceSchema = new mongoose.Schema({
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
    required: true
  },
  clientPhone: {
    type: String,
    required: true 
  },
  clientAddress: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["НЕ ОПЛАЧЕН", "ВЫСТАВЛЕНО", "ОПЛАЧЕН", "ОТМЕНЁН"],
    default: "НЕ ОПЛАЧЕН",
  },
  reason: {
    type: Number
  }
});
invoiceSchema.pre("save", async function (next) {
  const invoice = this;

  if (!invoice.isNew) return next();

  try {
    const sequenceDoc = await counterModel.findByIdAndUpdate(
      { _id: "invoiceNumber" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    invoice.invoiceNumber = sequenceDoc.sequence_value;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
