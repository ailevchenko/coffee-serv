const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get('secret');

module.exports = function (request, response, next) {
    if (request.method === "OPTIONS") {
        next();
    }

    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            return response.status(403).json({message: 'Пользователь не авторизован'});
        }
        const decodedData = jwt.verify(token, secret);
        request.user = decodedData;
        next();
    } catch (e) {
        return response.status(403).json({message: 'Пользователь не авторизован'});
    }
}
