const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["ВЫСТАВЛЕНО", "ОПЛАЧЕНО", "НЕ ОПЛАЧЕНО"],
      default: "ВЫСТАВЛЕНО",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", ordersSchema);
module.exports = Order;
