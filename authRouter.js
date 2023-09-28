const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require('express-validator')
const authMiddleware = require('./middleware/authmiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

router.post('/registration', [
    check('username', 'The name cannot be empty').notEmpty(),
    check('password', 'The password should be min 4 chars long and 20 chars max').isLength({ min: 4, max: 10 }),
],
    controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router;


