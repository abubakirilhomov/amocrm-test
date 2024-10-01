const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Invoice",
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", ordersSchema);
module.exports = Order;
