const Courses = require('../models/courseModel');
const Invoices = require('../models/invoiceModel');

async function getCourseById(id) {
    return await Courses.findById(id);
}


const checkPerform = async (req, res) => {
    const { amount, account } = req.body.params;

    try {
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

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: { allow: true }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
                code: -32000,
                message: { ru: 'Внутренняя ошибка сервера', uz: 'Ichki server xatosi', en: 'Internal server error' }
            }
        });
    }
};


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
    try {
        // Извлекаем 'id' и 'status' из запроса
        const { id, status } = req.body.params;

        if (!id) {
            throw new Error("Параметр 'id' отсутствует в запросе.");
        }

        if (status === undefined) {
            throw new Error("Параметр 'status' отсутствует в запросе.");
        }

        switch (status) {
            case 1:
                console.log(`Transaction ${id} is created.`);
                // Логика для создания транзакции
                break;

            case 2:
                console.log(`Transaction ${id} is completed.`);
                await completeTransaction(id);
                break;

            case -1:
            case -2:
                console.log(`Transaction ${id} is canceled.`);
                await cancelTransaction(id);
                break;

            default:
                return res.json({
                    jsonrpc: '2.0',
                    id: req.body.id,
                    error: {
                        code: -31008,
                        message: { ru: 'Неверный статус транзакции', uz: 'Noto‘g‘ri tranzaksiya holati', en: 'Invalid transaction status' }
                    }
                });
        }

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: { status: 'success' }
        });
    } catch (error) {
        console.error('Error in performTransaction:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
                code: -32000,
                message: { ru: 'Внутренняя ошибка сервера', uz: 'Ichki server xatosi', en: 'Internal server error' }
            }
        });
    }
};


async function cancelTransaction(transactionId) {
    const course = await Invoices.findOneAndUpdate(
        { status: 'НЕ ОПЛАЧЕНО' },
        { new: true }
    );
    return course;
}

module.exports = { checkPerform, createTransaction, performTransaction }