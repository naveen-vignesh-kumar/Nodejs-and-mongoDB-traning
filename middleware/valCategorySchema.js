const {body} = require('express-validator');

module.exports = [
					body('name').notEmpty().withMessage("Name should not be empty"),
				];