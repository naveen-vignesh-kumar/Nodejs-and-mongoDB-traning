const {body} = require("express-validator");

module.exports = [
				body('name').isEmpty().withMessage('Name should not be empty'),
				body('emailId').isEmail().withMessage('emailId should not be empty'),
				body('password').isLength({min:8}).withMessage('password should be greater than 8 letters'),

	];
