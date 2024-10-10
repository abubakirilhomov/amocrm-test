const Order = require("../models/orderModel");
const Course = require("../models/courseModel");
const Invoice = require("../models/invoiceModel");

const transformCashFromTiyinToSum = (amount) => {
  return Number(String(amount).slice(0, -2));
};

const checkTransaction = async (req, res) => {
  const { serviceId, timestamp, params } = req.body;

  console.log("Received request in checkPerform:", req.body);

  if (!serviceId) {
    return res.status(400).json({
      timestamp: timestamp,
      status: "FAILED",
      errorCode: "10006",
    });
  }

  if (!params || !params.courseId || params.amount <= 0 || !params.amount) {
    return res.status(400).json({
      serviceId: serviceId,
      timestamp: timestamp,
      status: "FAILED",
      errorCode: "10007",
    });
  }

  try {
    const course = (await Course.findById(params.courseId)) || null;

    if (!course || course?.price !== params.amount) {
      return res.status(400).json({
        serviceId: serviceId,
        timestamp: timestamp,
        status: "FAILED",
        errorCode: "10002",
      });
    }

    res.status(200).json({
      serviceId: serviceId,
      timestamp: timestamp,
      status: "OK",
      data: {
        courseId: {
          value: course._id,
        },
        price: {
          value: course.price,
        },
      },
    });
  } catch (error) {
    console.log("Received error: ", error);
    res.status(500).json({
      status: "FAILED",
      errorCode: "99999",
    });
  }
};

const createTransaction = async (req, res) => {
  const { serviceId, timestamp, transId, params, amount } = req.body;

  if (!serviceId) {
    return res.status(400).json({
      transId: transId,
      status: "FAILED",
      transTime: Date.now(),
      errorCode: "10006",
    });
  }

  if (!amount || !timestamp || !transId || !params) {
    return res.status(400).json({
      transId: transId,
      status: "FAILED",
      transTime: Date.now(),
      errorCode: "10005",
    });
  }

  if (!params.courseId) {
    console.error("Необходимые параметры отсутствуют в запросе:", req.body);
    return res.status(400).json({
      serviceId: serviceId,
      transId: transId,
      status: "FAILED",
      transTime: Date.now(),
      errorCode: "10007",
    });
  }

  try {
    let transaction = await Order.findOne({ transactionId: transId }) || null;
    const course = (await Course.findById(params.courseId)) || null;

    if (transaction || transaction?.transactionId) {
      return res.status(404).json({
        serviceId: serviceId,
        transId: transId,
        status: "FAILED",
        transTime: Date.now(),
        errorCode: "10010",
      });
    }

    if (!course) {
      return res.status(404).json({
        serviceId: serviceId,
        timestamp: timestamp,
        status: "FAILED",
        errorCode: "10002",
      });
    }
    if (course.price !== amount) {
      return res.status(400).json({
        serviceId: serviceId,
        timestamp: timestamp,
        status: "FAILED",
        errorCode: "10011",
      });
    }

    const newOrder = Order.create({
      transactionId: transId,
      invoiceNumber: transId,
      create_time: timestamp,
      amount: transformCashFromTiyinToSum(amount),
      course_id: course._id,
      status: 'НЕ ОПЛАЧЕНО',
      paymentType: "Uzum",
      clientName: params.clientName || "Не указано",
      clientPhone: params.clientPhone || "Не указано",
      clientAddress: params.clientAddress || "Не указано",
    });
    // await Invoice.findOneAndUpdate(
    //   { invoiceNumber: newOrder.invoiceNumber },
    //   { status: "ВЫСТАВЛЕНО" }
    // );

    res.status(201).json({
      serviceId: serviceId,
      transId: transId,
      status: "CREATED",
      transTime: 1698361458054,
      data: {
        courseId: {
          value: course._id,
        },
        status: {
          value: newOrder.status,
        },
      },
      amount: amount,
    });
  } catch (error) {
    console.log("Received error: ", error);
    res.status(500).json({
      status: "FAILED",
      errorCode: "99999",
    });
  }
};

const confirmTransaction = async (req, res) => {
  const {
    serviceId,
    timestamp,
    transId,
    paymentSource,
    tariff,
    processingReferenceNumber,
  } = req.body;

  if ((!serviceId, !timestamp, !transId, !paymentSource)) {
    return res.status(400).json({
      status: "FAILED",
      confirmTime: timestamp,
      errorCode: "10005",
    });
  }
  try {
    let order = (await Order.findOne({ transactionId: transId })) || null;

    if (!order || !order?.transactionId) {
      return res.status(404).json({
        serviceId: serviceId,
        transId: transId,
        status: "FAILED",
        confirmTime: timestamp,
        errorCode: "10014",
      });
    }
    switch (order.status) {
      case "ОТМЕНЕНО":
        return res.status(400).json({
          serviceId: serviceId,
          transId: transId,
          status: "FAILED",
          confirmTime: timestamp,
          errorCode: "10015",
        });
      case "ОПЛАЧЕНО":
        return res.status(400).json({
          serviceId: serviceId,
          transId: transId,
          status: "FAILED",
          confirmTime: timestamp,
          errorCode: "10016",
        });
    }

    order.status = "ОПЛАЧЕНО";
    order.perform_time = Date.now();
    await order.save();

    // await Invoice.findOneAndUpdate(
    //   { invoiceNumber: order.invoiceNumber },
    //   { status: "ОПЛАЧЕНО" }
    // );

    res.status(200).json({
      serviceId: serviceId,
      transId: transId,
      status: "CONFIRMED",
      confirmTime: Date.now(),
      data: {
        courseId: {
          value: order.course_id,
        },
        status: {
          value: order.status,
        },
      },
      amount: `${order.amount}00`,
    });
  } catch (error) {
    console.log("Received error: ", error);
    res.status(500).json({
      status: "FAILED",
      errorCode: "99999",
    });
  }
};

const reverseTransaction = async (req, res) => {
  const { serviceId, transId, timestamp } = req.body;

  if (!serviceId || !transId || !timestamp) {
    return res.status(400).json({
      status: "FAILED",
      reverseTime: Date.now(),
      errorCode: "10005",
    });
  }
  try {
    let order = (await Order.findOne({ transactionId: transId })) || null;

    if (!order || !order?.transactionId) {
      return res.status(404).json({
        serviceId: serviceId,
        transId: transId,
        status: "FAILED",
        confirmTime: timestamp,
        errorCode: "10014",
      });
    }
    switch (order?.status) {
      case "ОТМЕНЕНО":
        return res.status(400).json({
          serviceId: serviceId,
          transId: transId,
          status: "FAILED",
          confirmTime: Date.now(),
          errorCode: "10018",
        });
      case "ОПЛАЧЕНО":
        return res.status(400).json({
          serviceId: serviceId,
          transId: transId,
          status: "FAILED",
          confirmTime: Date.now(),
          errorCode: "10017",
        });
    }

    order.status = "ОТМЕНЕНО";
    order.save()

    // await Invoice.findOneAndUpdate(
    //   { invoiceNumber: order.invoiceNumber },
    //   { status: "ОТМЕНЕНО" }
    // );

    res.status(200).json({
      serviceId: serviceId,
      transId: transId,
      status: "REVERSED",
      reverseTime: Date.now(),
      data: {
        courseId: {
          value: order.course_id,
        },
        status: {
          value: order.status,
        },
      },
      amount: `${order.amount}00`,
    });
  } catch (error) {
    console.log("Received error: ", error);
    res.status(500).json({
      status: "FAILED",
      errorCode: "99999",
    });
  }
};

const checkTransactionStatus = async (req, res) => {
  const { serviceId, timestamp, transId } = req.body;

  if (!serviceId || !transId || !timestamp) {
    return res.status(400).json({
      status: "FAILED",
      errorCode: "10005",
    });
  }

  try {
    const order = (await Order.findOne({ transactionId: transId })) || null;

    if (!order || !order?.transactionId) {
      return res.status(404).json({
        serviceId: serviceId,
        transId: transId,
        status: "FAILED",
        transTime: order.create_time || null,
        confirmTime: order.perform_time || null,
        reverseTime: order.cancel_time || null,
        errorCode: "10014",
      });
    }

    res.status(200).json({
      serviceId: serviceId,
      transId: order.transactionId,
      status: order.status,
      transTime: order.create_time || null,
      confirmTime: order.perform_time || null,
      reverseTime: order.cancel_time || null,
      data: {
        courseId: {
          value: order.course_id,
        },
      },
      amount: `${order.amount}00`,
    });
  } catch (error) {
    console.log("Received error: ", error);
    res.status(500).json({
      status: "FAILED",
      errorCode: "99999",
    });
  }
};

module.exports = {
  checkTransaction,
  createTransaction,
  confirmTransaction,
  reverseTransaction,
  checkTransactionStatus,
};
