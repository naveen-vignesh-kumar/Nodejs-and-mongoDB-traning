const {body,check} = require("express-validator");

const Addaleorderval = [
				body("quantity").notEmpty().withMessage("quantity should not be empty"),
				body("productId").notEmpty().withMessage("productId should not be empty"),
];

const Addcollectionval = [
				body('soId').notEmpty().withMessage('soId should not be notEmpty'),
				body('collectionAmount').notEmpty().withMessage('collectionAmount should not be notEmpty'),
				body('collectionType').notEmpty().withMessage('collectionType should not be notEmpty'),
];

const SOStatusDist = [
					check('id').notEmpty().withMessage("Id Should not be empty"),
					check('status').notEmpty().withMessage("Status Should not be empty"),
				];

module.exports = {Addaleorderval,Addcollectionval,SOStatusDist};