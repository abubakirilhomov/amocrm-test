const Courses = require('../models/courseModel');
const Invoices = require('../models/invoiceModel');
const Order = require('../models/ordersModel');

const checkPerform = async (req, res) => {
    const { amount, account } = req.body.params;

    const course = await getCourseById(account.course_id);

    if (!course) {
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
                code: -31050,
                message: { ru: 'Курс не найден', uz: 'Kurs topilmadi', en: 'Course not found' }
            }
        });
    }

    if (course.price !== amount) {
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
                code: -31001,
                message: { ru: 'Неверная сумма', uz: 'Noto‘g‘ri summa', en: 'Incorrect amount' }
            }
        });
    }

    const newOrder = new Order({
        course_id: account.course_id,
        user_id: account.user_id,
        amount: amount,
        status: 'pending'
    });

    await newOrder.save();

    res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: { allow: true }
    });
}

async function getCourseById(id) {
    const course = await Courses.findById(id);
    return course;
}

const createTransaction = async (req, res) => {
    const { course_id, amount } = req.body;

    try {
        const course = await Courses.findById(course_id);

        if (!course) {
            return res.status(404).json({
                jsonrpc: '2.0',
                error: {
                    code: -31050,
                    message: { ru: 'Курс не найден', uz: 'Kurs topilmadi', en: 'Course not found' }
                }
            });
        }

        if (course.price !== amount) {
            return res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -31001,
                    message: { ru: 'Неверная сумма', uz: 'Noto‘g‘ri summa', en: 'Incorrect amount' }
                }
            });
        }

        const transactionId = `txn_${new Date().getTime()}`; 
        const createTime = Date.now(); 

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: {
                create_time: createTime, 
                transaction: transactionId, 
                state: 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const performTransaction = async (req, res) => {
    const { transaction_id, status } = req.body.params;

    switch (status) {
        case 1:
            console.log(`Transaction ${transaction_id} is created.`);
            break;

        case 2:
            console.log(`Transaction ${transaction_id} is completed.`);
            await completeTransaction(transaction_id);
            break;
        case -1:
        case -2:
            console.log(`Transaction ${transaction_id} is canceled.`);
            await cancelTransaction(transaction_id);
            break;

        default:
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31001,
                    message: { ru: 'Транзакция не существует', uz: 'Transaksiya mavjud emas', en: 'Transaction does not exist' }
                }
            });
    }

    res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: { status: 'success' }
    });
}

async function completeTransaction(transactionId) {
    const course = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'completed' },
        { new: true }
    );
    return course;
}

async function cancelTransaction(transactionId) {
    const course = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'canceled' },
        { new: true }
    );
    return course;
}

module.exports = { checkPerform, createTransaction, performTransaction }