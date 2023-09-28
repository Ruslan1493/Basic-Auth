const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Role = require('./models/Role');
const { secret } = require('./config');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, secret, { expiresIn: '24h' });
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Registtration error', errors });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: 'User already exists' })
            }

            const salt = await bcrypt.genSalt(7);
            const hashedPass = await bcrypt.hash(password, salt);
            const userRole = await Role.findOne({ value: 'USER' });

            const user = new User({
                username,
                password: hashedPass,
                roles: [userRole.value]
            })
            await user.save();
            return res.status(200).json({ message: 'User successfully registered' });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const validPassword = bcrypt.compareSync(password, user?.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Incorrect password entered' });
            }
            const token = generateAccessToken(user?._id, user?.roles);
            return res.json({ token, message: 'Successfully logged in' });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Login error' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json({ message: 'Users successfully loaded', users })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Login error' });
        }
    }
}

module.exports = new authController();