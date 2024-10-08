const Courses = require('../models/courseModel');
const Orders = require('../models/orderModel');
const Invoice = require('../models/invoiceModel');

const handlePaymeRequest = async (req, res) => {
    const { method } = req.body;

    switch (method) {
        case 'CheckPerformTransaction':
            await checkPerform(req, res);
            break;
        case 'CreateTransaction':
            await createTransaction(req, res);
            break;
        case 'PerformTransaction':
            await performTransaction(req, res);
            break;
        case 'CheckTransaction':
            await checkTransaction(req, res);
            break;
        case 'GetStatement':
            await getStatement(req, res);
            break;
        default:
            res.json({
                jsonrpc: '2.0',
                id: req.body.id || null,
                error: {
                    code: -32601,
                    message: {
                        ru: 'Метод не найден',
                        uz: 'Usul topilmadi',
                        en: 'Method not found'
                    }
                }
            });
    }
};

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
                code: -31008,
                message: {
                    ru: 'Ошибка на стороне сервера',
                    uz: 'Server tomonda xatolik',
                    en: 'Server error'
                }
            }
        });
    }
};

const createTransaction = async (req, res) => {
    const { id, time, amount, account } = req.body.params || {};

    console.log('Received request in createTransaction:', req.body);

    if (!account || !account.course_id || !id || !time) {
        console.error('Необходимые параметры отсутствуют в запросе:', req.body);
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31050,
                message: {
                    ru: 'Параметры запроса неверны',
                    uz: 'So‘rov parametrlari noto‘g‘ri',
                    en: 'Request parameters are invalid'
                },
                data: 'params'
            }
        });
    }
    try {
        let transaction = await Orders.findOne({ transactionId: id });

        if (transaction) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                result: {
                    create_time: transaction.create_time,
                    transaction: transaction.transactionId,
                    state: transaction.state
                }
            });
        }

        transaction = new Orders({
            transactionId: id,
            invoiceNumber: id,
            create_time: time,
            amount: amount,
            state: 1,
            course_id: account.course_id,
            clientName: account.clientName || 'Не указано',
            clientPhone: account.clientPhone || 'Не указано',
            clientAddress: account.clientAddress || 'Не указано',
            status: 'ВЫСТАВЛЕНО'
        });

        await transaction.save();

        await Invoice.findOneAndUpdate(
            { invoiceNumber: transaction.invoiceNumber },
            { status: 'ВЫСТАВЛЕНО' }
        );

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: {
                create_time: transaction.create_time,
                transaction: transaction.transactionId,
                state: transaction.state
            }
        });
    } catch (error) {
        console.error('Error in createTransaction:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31008,
                message: {
                    ru: 'Ошибка на стороне сервера',
                    uz: 'Server tomonda xatolik',
                    en: 'Server error'
                },
                data: 'server'
            }
        });
    }
};


const performTransaction = async (req, res) => {
    const { id } = req.body.params || {};

    console.log('Received request in performTransaction:', req.body);

    if (!id) {
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31050,
                message: {
                    ru: 'Идентификатор транзакции отсутствует',
                    uz: 'Tranzaksiya identifikatori mavjud emas',
                    en: 'Transaction ID is missing'
                },
                data: 'id'
            }
        });
    }

    try {
        let transaction = await Orders.findOne({ transactionId: id });

        if (!transaction) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31003,
                    message: {
                        ru: 'Транзакция не найдена',
                        uz: 'Tranzaksiya topilmadi',
                        en: 'Transaction not found'
                    },
                    data: 'id'
                }
            });
        }

        if (transaction.state === 2) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                result: {
                    transaction: transaction.transactionId,
                    perform_time: transaction.perform_time,
                    state: transaction.state,
                    status: transaction.status
                }
            });
        }

        transaction.state = 2;
        transaction.perform_time = Date.now();
        transaction.status = 'ОПЛАЧЕНО';
        await transaction.save();

        await Invoice.findOneAndUpdate(
            { invoiceNumber: transaction.invoiceNumber },
            { status: 'ОПЛАЧЕНО' }
        );

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: {
                transaction: transaction.transactionId,
                perform_time: transaction.perform_time,
                state: transaction.state,
                status: transaction.status
            }
        });
    } catch (error) {
        console.error('Error in performTransaction:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31008,
                message: {
                    ru: 'Ошибка на стороне сервера',
                    uz: 'Server tomonda xatolik',
                    en: 'Server error'
                },
                data: 'server'
            }
        });
    }
};



const checkTransaction = async (req, res) => {
    const { id } = req.body.params || {};

    console.log('Received request in checkTransaction:', req.body);

    if (!id) {
        return res.json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31050,
                message: {
                    ru: 'Идентификатор транзакции отсутствует',
                    uz: 'Tranzaksiya identifikatori mavjud emas',
                    en: 'Transaction ID is missing'
                },
                data: 'id'
            }
        });
    }

    try {
        let transaction = await Orders.findOne({ transactionId: id });

        if (!transaction) {
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31003,
                    message: {
                        ru: 'Транзакция не найдена',
                        uz: 'Tranzaksiya topilmadi',
                        en: 'Transaction not found'
                    },
                    data: 'id'
                }
            });
        }

        res.json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: {
                create_time: transaction.create_time,
                perform_time: transaction.perform_time || 0,
                cancel_time: transaction.cancel_time || 0,
                transaction: transaction.transactionId,
                state: transaction.state,
                reason: transaction.reason || null
            }
        });
    } catch (error) {
        console.error('Error in checkTransaction:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id || null,
            error: {
                code: -31008,
                message: {
                    ru: 'Ошибка на стороне сервера',
                    uz: 'Server tomonda xatolik',
                    en: 'Server error'
                },
                data: 'server'
            }
        });
    }
};

const getStatement = async (req, res) => {
    const { from, to } = req.body.params;  // Получаем даты из запроса

    try {
        // Пример запроса к базе данных для получения транзакций по дате
        const transactions = await Orders.find({
            create_time: {
                $gte: new Date(from),
                $lte: new Date(to),
            },
        });

        // Если транзакции найдены, возвращаем их
        if (transactions.length > 0) {
            res.json({
                jsonrpc: "2.0",
                id: req.body.id,
                result: {
                    transactions: transactions,
                },
            });
        } else {
            res.json({
                jsonrpc: "2.0",
                id: req.body.id,
                result: {
                    transactions: [],
                },
            });
        }
    } catch (error) {
        console.error("Ошибка в методе GetStatement:", error);
        res.status(500).json({
            jsonrpc: "2.0",
            id: req.body.id,
            error: {
                code: -32000,
                message: {
                    ru: "Ошибка сервера",
                    en: "Server error",
                },
            },
        });
    }
};


module.exports = { handlePaymeRequest };
