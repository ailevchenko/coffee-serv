const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get('secret');

module.exports = function (roles) {
    return function (request, response, next) {
        if (request.method === "OPTIONS") {
            next();
        }

        try {
            const token = request.headers.authorization.split(' ')[1];
            if (!token) {
                return response.status(403).json({message: 'Пользователь не авторизован'});
            }

            const {roles: userRoles} = jwt.verify(token, secret);
            let hasRole = false;

            userRoles.forEach(role => {
                console.log(role);
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                return response.status(403).json({message: 'У вас нет доступа'});
            }

            next();
        } catch (e) {
            return response.status(403).json({message: `Пользователь не авторизован, ${e.message}`});
        }
    }
}
