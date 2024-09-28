const express = require('express');
const Invoices = require('../models/invoiceModel'); // Импортируйте модель курсов
const router = express.Router();

// Метод для завершения транзакции
router.post('/perform-transaction', async (req, res) => {
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
            // Транзакция отменена
            console.log(`Transaction ${transaction_id} is canceled.`);
            // Здесь обновите статус курса в вашей системе
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

    // Успешный ответ
    res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: { status: 'success' }
    });
});

// Функция для обновления статуса завершенной транзакции
async function completeTransaction(transactionId) {
    // Обновите статус курса в базе данных
    // Например, вы можете обновить курс, связанный с этой транзакцией
    const course = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId }, // Убедитесь, что у вас есть поле для связи
        { status: 'completed' }, // Обновите статус
        { new: true }
    );
    return course;
}

// Функция для отмены транзакции
async function cancelTransaction(transactionId) {
    const course = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'canceled' },
        { new: true }
    );
    return course;
}

module.exports = router;
