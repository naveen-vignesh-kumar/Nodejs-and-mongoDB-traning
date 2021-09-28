const distributorModel = require('../models/distributorModel');
const salesmanModel = require('../models/salesmanModel');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const retailerModel = require('../models/retailerModel');
const salesorderModel = require('../models/salesorderModel');
const collectModel = require('../models/collectModel'); 

const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');


exports.register = async(req,res)=>{
	 try{	 	
		var hashPassword = await bcrypt.hash(req.body.password, 10);

		const save = await new distributorModel({
			distname: req.body.name,
			distId: "DIST"+ Math.floor(1000 + Math.random() * 9000),
			emailId : req.body.emailId,
			password: hashPassword
		}).save().then((result)=>{
			res.status(200).json({
				error:false,
				message:'Inserted successfully'
			});
		}).catch((err)=>{
			res.status(500).json({
				error:true,
				message:err.message
			});
		});
	}catch(err){
		res.status(500).json({error:err});
	}
	
}

exports.login = async (req,res)=>{
	try{

		var checkDist= await distributorModel.findOne({emailId: req.body.emailId, activation:'active'});
		if(!checkDist.distname && !checkDist){
			res.status(404).json({error:true,message:'user not found'});
		}
		var check_password= await bcrypt.compare(req.body.password , checkDist.password)

		if(!check_password){
			res.status(404).json({error:true,message:'Incorrect password'});				
		}

		let token = await jwt.sign({distId:checkDist.distId,emailId:checkDist.emailId}, process.env.DIST_JWT,{ expiresIn: '1h' });

		res.status(200).json({error:false,data:{token:token}});
		
	}catch(err){
		res.status(500).json({error:err});
	}

}

/*Add salesman List salesman and update salesman*/

exports.addSalesman= async (req,res,next)=>{
	
	try{

	let distDet = await distributorModel.findOne({emailId:req.distData.emailId});
	let hashPassword = await bcrypt.hash(req.body.password,10);
	let save= await new salesmanModel({
		name: req.body.name,
		salesmanId: "SAL"+ Math.floor(1000 + Math.random() * 9000),
		distributorId:  distDet._id,
		emailid: req.body.emailId,
		password: hashPassword,
	}).save()
	.then(result=>{
		res.status(200).json({error:false,data:result})
	})
	.catch(e=>{
		res.status(500).json({error:true,message:e.message})
	});
	}catch(error){
		res.status(500).json({error:true,message:error.message})
	}


}

exports.salesmanList= async(req,res,next)=>{

	try{

	let distDet = await distributorModel.findOne({emailId:req.distData.emailId});
	if(req.query.name || req.query.emailId){

		let data= await salesmanModel.find({
	      $and: [
	        { $or: [{name: req.query.name}, {emailid: req.query.emailid}] },
	        { distributorId:distDet._id }
	      ]
	  	});
		res.status(200).json({error: false,data:data});
	}else{
		let data = await salesmanModel.find({distributorId:distDet._id})
		res.status(200).json({error: false,data:data});
	}
	}catch(e){
		res.status(500).json({error: true,error:e.message})
	}
}

exports.updateSalesman= async (req,res,next)=>{
	
	try{
		if(!req.body.name){
			res.status(400).json({error: true, message: "salesman Name should not be empty"});
		}
		if(!req.query.salesmanid){
			res.status(400).json({error: true, message: "salesman id should not empty"});
		}
		let upd = await salesmanModel.findOneAndUpdate({emailId:req.body.emailId},{
			$set:{name: req.body.name}
		});
		if(upd){
			res.json(200).json({error: false, message: "Successfully Updated" });
		}
	}catch(error){
		res.status(500).json({error:true,message:error.message})
	}
}
/*Add product and update*/
exports.addProduct= async (req,res,next)=>{
	try{
		let checkCat = await categoryModel.findOne({name:req.body.category});
		if(!checkCat){
			res.status(404).json({error:true, message:"category is not found"});
		}
		
		await new productModel({
			productname: req.body.productname,
			productId: "PROD"+ Math.floor(1000 + Math.random() * 9000),
			price: req.body.price,
			stock: [{
				totalstock: req.body.stock,
				unit: req.body.unit,
				pieces : req.body.pieces
			}],
			
			description: req.body.description,
			categoryid: checkCat._id
		}).save()
		.then(result =>{
			res.status(200).json({error: false,data: result});
		})
		.catch((e)=>{
			res.status(500).json({error: false, message:e.message});
		});
	
	}catch(err){
		res.status(500).json({error: true,message:err.message});
	}
}

exports.updateProduct = async (req,res,next)=>{
	try{
		if(!req.query.id){
			res.status(400).json({error:true,message: "Product Id missing to update"})
		}	

		var updItems = {};
		var updateStock = {};
		if(req.body.productname){
			updItems.productname = req.body.productname;
		}
		if(req.body.price){
			updItems.price = req.body.price;
		}
		
		if(req.body.stock){
			let stockval= await productModel.findById(req.query.id);
			updItems['stock.$[].totalstock']= req.body.stock+ stockval.stock[0].totalstock;
		}
		if(req.body.unit){
			updItems['stock.$[].unit'] = req.body.unit;
		}
		if(req.body.pieces){
			updItems['stock.$[].pieces'] = req.body.pieces;
		}

		var upd = await productModel.findByIdAndUpdate(req.query.id,{
			$set: updItems
			},
			{new:true});
		res.status(200).json({error: false,data:upd});

	}catch(err){
		res.status(500).json({error: true, message:err.message});
	}
}

exports.productList = async (req,res,next)=>{
	try{
		if(!req.query.productname){
			req.query.productname='';
		}
		if(! req.query.productId){
			 req.query.productId='';
		}

		await productModel.find({
			$and: [
    		    {productname: {$regex: '.*' +req.query.productname+".*"}},
    	  		{productId: {$regex: '.*' +req.query.productId+".*"}}
	      	]
		})
		.populate('categoryid','name')
		.then(result=>{
			
			let countObj = {};
			countObj['count'] = result.length; 
			
			result.push(countObj);

			res.status(200).json({error: false, data: result});
		}).catch(err=>{
			res.status(500).json({error: true, message:err.message});
		});
	}catch(err){
		res.status(500).json({error: true,message: err.message});
	}
} 

exports.addCategory = async (req,res,next)=>{
	try{
		let ins = await new categoryModel({
			name: req.body.name
		}).save()
		.then(result=>{
			res.status(200).json({error: false, data:result});
		})
		.catch(e=>{
			res.status(400).json({error: false, message:e.message});
		});
	}catch(err){
		res.status(500).json({error: true,message: err.message});
	}
}

exports.retailerList = async(req,res,next)=>{
	try{
		let distDet = await distributorModel.findOne({emailId:req.distData.emailId});

		if(!req.query.retailername){
			req.query.retailername='';
		}
		if(! req.query.storename){
			 req.query.storename='';
		}
		if (!req.query.retailerId) {
			req.query.retailerId='';
		}
		let limit= req.query.limit?req.query.limit:10;
		let skip= req.query.skip?req.query.skip:0;

		let data= await retailerModel.find({
	      $and: [
    		    {name: {$regex: '.*' +req.query.retailername+".*"}},
    	  		{storename: {$regex: '.*' +req.query.storename+".*"}},
    	  		{retailerId: {$regex: '.*' +req.query.retailerId+".*"}},
        		{ distId:distDet._id }
	      ]
	  	}).select('_id name storename emailid phone retailerId address').sort("-createdAt").skip(skip).limit(limit);

		let countObj = {};
		countObj['count'] = data.length; 
		
		data.push(countObj);
  	
	  	res.status(200).json({error: false,data:data});

	}catch(e){
		res.status(500).json({error: true,message: e.message});	
	}
}

exports.retailerStatus = async(req,res,next)=>{
	try{
		if(!req.body.status){
			res.status(400).json({error: true,message:"status should not be empty"});
		} 
		let updateStatus = await retailerModel.findByIdAndUpdate(req.body.id,{
			$set:{status: req.body.status}
		});
		
		res.status(200).json({error: false,message: "updated successfully"});	
		
	}catch(err){
		res.status(500).json({error: true,message: err.message});	
	}
}

exports.salesOrderList=async(req,res,next)=>{
	try{
		let distDet = await distributorModel.findOne({emailId:req.distData.emailId});

		const limit = parseInt(req.query.limit?req.query.limit:10);
		const skip= req.query.skip?req.query.skip:0;
		
		let checkSalesOrder = await salesorderModel.find({distributorId:distDet._id})
		.select('_id quantity status salesmanId retailerId productId')
		.sort({"createdAt":-1}).skip(skip).limit(limit)
		.populate('salesmanId','name salesmanId')
		.populate('retailerId','name retailerId')
		.populate('productId','name productId')
		.then(result=>{
			let countObj = {};
			countObj['count'] = result.length; 
			
			result.push(countObj);

			res.status(200).json({error: false, data: result});
		})
		.catch((e)=>{
			res.status(500).json({error: true, error:e.message})
		});

		

	}catch(err){
		res.status(500).json({error: true,message: err.message});
	}
}

exports.updateSalesorderStatus= async(req,res,next)=>{
	try{
		let upd = await salesorderModel.findByIdAndUpdate(req.query.id,{
			$set:{
				status:req.query.status
			}
		}).then(result=>{
			res.status(200).json({error:false,message:'Updated Successfully'});
		}).catch(e=>{
			res.status(500).json({error:true,message:e.message});
		});
		
	}catch(err){
		res.status(500).json({error:true,message:err.message});
	}
}




exports.collectionList = async(req,res,next)=>{
	try{	
		let distDet = await distributorModel.findOne({emailId:req.distData.emailId}).select('_id');
		
		const limit= parseInt(req.query.limit?req.query.limit:10);
		const skip= req.query.skip?req.query.skip:0;

		var collStatus = req.query.status?req.query.status:'pending';

		let getColl = await collectModel.aggregate([
			{
		        $lookup: {
		            from: "salesordermodels",
		            localField: "saleorderId",
		            foreignField: "_id",
		            as: "salorderColl"
		        }
    		},
    		{
			    $unwind: "$salorderColl",
			}
		]).match({$and: [{ "salorderColl.distributorId":distDet._id},{'status':collStatus}]})
		.project({_id:1,collect:1,collecType:1,status:1,createdAt:1,"salorderColl._id":1,"salorderColl.quantity":1,})
		.sort({"createdAt":-1})
		.skip(skip).limit(limit)
		.then((result) => {
			let countObj = {};
			countObj['count'] = result.length; 
			
			result.push(countObj)
			res.json({error:false , data:result});
		})
		.catch((error) => {
			res.json({error:true,message:error.message});
		});

		
	}catch(err){
		res.status().json({error:false,message: err.message});
	}
}
