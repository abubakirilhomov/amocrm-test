const mongoose = require("mongoose");
const Counter = require("./counterModel");

const invoiceSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientAddress: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["НЕ ОПЛАЧЕН", "ВЫСТАВЛЕНО", "ОПЛАЧЕН", "ОТМЕНЁН"],
      default: "НЕ ОПЛАЧЕН",
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.pre("save", async function (next) {
  const invoice = this;

  if (!invoice.isNew) return next();

  try {
    const sequenceDoc = await Counter.findByIdAndUpdate(
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

module.exports = mongoose.model("Invoice", invoiceSchema);
