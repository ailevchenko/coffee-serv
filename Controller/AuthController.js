const User = require('../Model/User');
const Role = require('../Model/Role');
const config = require('config');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const SECRET = config.get('secret');

const generateAccessToken = (id, roles)=> {
    const payload = {
        id,
        roles
    };

    return jwt.sign(payload, SECRET, {expiresIn: "24h"});
}

class AuthController {
    async registration(request, response) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({message: 'Ошибка при регистрации', errors});
            }

            const {name, email, password} = request.body;
            const candidate = await User.findOne({name});

            if (candidate) {
                return response.status(400).json({message: 'Пользователь с таким именем уже существует'});
            }

            const hashPassword = await bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'User'});
            const user = new User({name, email, password: hashPassword, roles: [userRole.value]});
            await user.save();

            return response.status(201).json({message: 'Пользователь успешно зарегистрирован'});
        } catch (e) {
            response.status(500).json({message: `AuthController Error registration, ${e.message}`});
        }
    };

    async login(request, response) {
        try {
            const {name, password} = request.body;
            const user = await User.findOne({name});
            if (!user) {
                return response.status(400).json({message: `Пользователь ${name} не найден`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return response.status(400).json({message: `Ввёден неверный пароль`})
            }

            const token = generateAccessToken(user._id, user.roles);
            return response.json({token});
        } catch (e) {
            response.status(400).json({message: `AuthController Error login, ${e.message}`});
        }
    };

    async getUsers(request, response) {
        try {
            const users = await User.find();
            response.json(users);
        } catch (e) {
            response.status(400).json({message: `AuthController Error getUsers, ${e.message}`});
        }
    };

    async getRoles(request, response) {
        try {
            const roles = await Role.find();
            response.json(roles);
        } catch (e) {
            response.status(400).json({message: `AuthController Error getRoles, ${e.message}`});
        }
    };
}

module.exports = new AuthController();
