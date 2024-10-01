const Courses = require('../models/courseModel');
const Invoices = require('../models/invoiceModel');

// Функция для получения курса по ID
async function getCourseById(id) {
    return await Courses.findById(id);
}

const checkPerform = async (req, res) => {
    const { amount, account } = req.body.params || {};

    console.log('Received request in checkPerform:', req.body);

    if (!account || !account.course_id) {
        console.error('Account или account.course_id отсутствует в запросе:', req.body);
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31050,
                message: {
                    ru: 'Параметры запроса неверны',
                    uz: 'So‘rov parametrlari noto‘g‘ri',
                    en: 'Request parameters are invalid'
                }
            }
        });
    }

    try {
        const course = await getCourseById(account.course_id);

        if (!course) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31050,
                    message: {
                        ru: 'Курс не найден',
                        uz: 'Kurs topilmadi',
                        en: 'Course not found'
                    }
                }
            });
        }

        if (course.price !== amount) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31001,
                    message: {
                        ru: 'Неверная сумма',
                        uz: 'Noto‘g‘ri summa',
                        en: 'Incorrect amount'
                    }
                }
            });
        }

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: { allow: true }
        });
    } catch (error) {
        console.error('Error in checkPerform:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -32000,
                message: {
                    ru: 'Внутренняя ошибка сервера',
                    uz: 'Ichki server xatosi',
                    en: 'Internal server error'
                }
            }
        });
    }
};

const createTransaction = async (req, res) => {
    const { account, amount } = req.body.params || {};

    console.log('Received request in createTransaction:', req.body);

    if (!account || !account.course_id) {
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31050,
                message: {
                    ru: 'Параметры запроса неверны',
                    uz: 'So‘rov parametrlari noto‘g‘ri',
                    en: 'Request parameters are invalid'
                }
            }
        });
    }

    try {
        const course = await Courses.findById(account.course_id);

        if (!course) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31050,
                    message: {
                        ru: 'Курс не найден',
                        uz: 'Kurs topilmadi',
                        en: 'Course not found'
                    }
                }
            });
        }

        if (course.price !== amount) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31001,
                    message: {
                        ru: 'Неверная сумма',
                        uz: 'Noto‘g‘ri summa',
                        en: 'Incorrect amount'
                    }
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
        console.error('Error in createTransaction:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -32000,
                message: {
                    ru: 'Внутренняя ошибка сервера',
                    uz: 'Ichki server xatosi',
                    en: 'Internal server error'
                }
            }
        });
    }
};

const performTransaction = async (req, res) => {
    try {
        const { id, account, amount } = req.body.params || {};

        console.log('Received request in performTransaction:', req.body);

        if (!id || !account || !account.course_id) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id || null,
                error: {
                    code: -31050,
                    message: {
                        ru: 'Параметры запроса неверны',
                        uz: 'So‘rov parametrlari noto‘g‘ri',
                        en: 'Request parameters are invalid'
                    }
                }
            });
        }

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: {
                transaction: id,
                perform_time: Date.now(),
                state: 2 
            }
        });
    } catch (error) {
        console.error('Error in performTransaction:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -32000,
                message: {
                    ru: 'Внутренняя ошибка сервера',
                    uz: 'Ichki server xatosi',
                    en: 'Internal server error'
                }
            }
        });
    }
};

async function completeTransaction(transactionId) {
    const invoice = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'ОПЛАЧЕНО' },
        { new: true }
    );

    if (!invoice) {
        throw new Error('Invoice not found');
    }

    return invoice;
}

async function cancelTransaction(transactionId) {
    const invoice = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'НЕ ОПЛАЧЕНО' },
        { new: true }
    );

    if (!invoice) {
        throw new Error('Invoice not found');
    }

    return invoice;
}

module.exports = { checkPerform, createTransaction, performTransaction };
