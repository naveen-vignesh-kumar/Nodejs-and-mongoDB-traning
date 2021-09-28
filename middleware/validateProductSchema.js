const {body} = require('express-validator');

module.exports = [
				body('productname').notEmpty().withMessage('Productname should not be notEmpty'),
				body('price').notEmpty().withMessage('price should not be notEmpty'),
				body('stock').notEmpty().withMessage('stock should not be notEmpty'),
				body('unit').notEmpty().withMessage('unit should not be notEmpty'),
				body('description').notEmpty().withMessage('description should not be notEmpty'),	
				body('category').notEmpty().withMessage('category should not be notEmpty'),	
];