const Router = require('express');
const { check } = require('express-validator');
const router = new Router();

const authController = require('../Controller/AuthController');
const authMiddleware = require('../middleware/auth.Middleware');
const roleMiddleware = require('../middleware/role.Middleware');

router.post('/registration',
    [
        check('name', 'Имя пользователя не может быть пустым').notEmpty(),
        check('email', 'Введите корректный адрес почты').isEmail(),
        check('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({min: 4, max: 10})
    ], authController.registration);

router.post('/login', authController.login);
router.get('/users', [roleMiddleware(['Seller']), authMiddleware(['User'])], authController.getUsers);
router.get('/roles', authController.getRoles);

module.exports = router;
