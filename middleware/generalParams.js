const {validationResult} = require('express-validator');

module.exports = async(req,res,next)=>{
	let errors = validationResult(req); 
	if(!errors.isEmpty()){
		res.status(400).json({error: true,message: errors});
	}
	next();
}