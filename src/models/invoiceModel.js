const mongoose = require('mongoose');
const counterModel = require('./counterModel');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: false
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
    enum: ["НЕ ОПЛАЧЕНО", "ВЫСТАВЛЕНО", "ОПЛАЧЕНО", "ОТМЕНЕНО"],
    default: "НЕ ОПЛАЧЕНО",
  },
}, { timestamps: true });
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
