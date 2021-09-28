const {body} = require('express-validator');

module.exports = [
				body('password').notEmpty().withMessage("password should not be empty"),
];