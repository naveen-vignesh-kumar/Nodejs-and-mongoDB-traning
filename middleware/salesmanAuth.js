var jwt = require('jsonwebtoken');

module.exports = async (req,res,next)=>{
	try{
		let token = req.headers.authorization.split(" ")[1]; 
		 const decode =await jwt.verify(token,process.env.SAL_JWT);
		req.salemandata = decode;
		next();
	}	
	catch(error){
		res.status(500).json({error:true,message: 'Authorization failed'});
	}	
} 