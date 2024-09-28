const jwt = require('jsonwebtoken');
require('dotenv').config();  // Загружаем переменные окружения

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Используем секретный ключ из переменной окружения
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
