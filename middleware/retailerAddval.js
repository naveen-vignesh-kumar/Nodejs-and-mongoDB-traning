const {body} = require('express-validator');

module.exports = [
				body('name').notEmpty().withMessage("name should not be empty"),
				body('storename').notEmpty().withMessage("storename should not be empty"),
				body('emailid').notEmpty().withMessage("emailid should not be empty"),
				body('phone').notEmpty().withMessage("phone should not be empty"),
				body('address').notEmpty().withMessage("address should not be empty"),
];