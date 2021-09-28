const {body} = require('express-validator');

const valRegistrationSchema = [
								body('name').notEmpty().withMessage('Name is should not be empty'),
								body('password').isLength({min:8}).withMessage('Password Should be greater than 8 letters'),
								body('emailId').isEmail().withMessage('Email is should not be empty'), 
							];

const valLoginSchema = [
						body('emailId').isEmail().withMessage('Email should not be empty'),
						body('password').isLength({min:8}).withMessage('Password Should be greater than 8 letters')
						];

module.exports ={valRegistrationSchema,valLoginSchema};