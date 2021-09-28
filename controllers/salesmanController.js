const salesmanModel = require('../models/salesmanModel');
const retailerModel = require('../models/retailerModel');
const salesorderModel = require('../models/salesorderModel');
const productModel = require('../models/productModel');
const collectModel = require('../models/collectModel'); 
const categoryModel = require('../models/categoryModel');

const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

exports.login = async(req,res,next)=>{
	try{
	let salesmanDet= await salesmanModel.findOne({
		$and:[
		{$or:[{salesmanId:req.body.salesmanId},{emailid:req.body.emailId} ]},
		{status:"active"}
		]
	});
	if(!salesmanDet){
		res.status(404).json({error: true,message:"salesman not found"});
	}

	let checkPassword =await bcrypt.compare(req.body.password ,salesmanDet.password);
	if(!checkPassword){
		res.status(404).json({error:true,message:'Incorrect password'});				
	}

	let token = await jwt.sign({salesmanId:salesmanDet.salesmanId,emailId:salesmanDet.emailid},process.env.SAL_JWT,{expiresIn: '1h'});
	res.status(200).json({error:false,token:token});
	}catch(e){
		res.status(500).json({error:true,message:e.message});
	}

}

exports.addRetailer =async(req,res,next)=>{
	try{
		checksalesman = await salesmanModel.findOne({salesmanId:req.salemandata.salesmanId});
		
		if(!checksalesman){
			res.status(400).json({error:true,message:"salesman Not found"});
		}
		
		await new retailerModel({
			name: req.body.name,
			storename: req.body.storename,
			retailerId: "RET"+ Math.floor(1000 + Math.random() * 9000),
			salesmanId: checksalesman._id,
			distId: checksalesman.distributorId,
			emailid: req.body.emailid,
			phone: req.body.phone,
			address: req.body.address
		}).save()
		.then(result =>{
			res.status(200).json({error: false,data: result});
		})
		.catch(e=>{
			res.status(500).json({error: true, message:e.message});
		});

	}catch(e){
		res.status(500).json({error:true,message:e.message});
	}
}

exports.retailerList=async(req,res,next)=>{
	try{
		let checksalesman = await salesmanModel.findOne({salesmanId:req.salemandata.salesmanId});

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

		let data= await retailerModel.find({
			$and: [
    		    {name: {$regex: '.*' +req.query.retailername+".*"}},
    	  		{storename: {$regex: '.*' +req.query.storename+".*"}},
    	  		{retailerId: {$regex: '.*' +req.query.retailerId+".*"}},
    	  		{status: "active"},
        		{ distId:checksalesman.distributorId }
	      	]
		}).select('_id name storename emailid phone retailerId address').sort("-createdAt").limit(limit); 
		res.status(200).json({error:false,data:data});

	}catch(e){
		res.status(500).json({error:true,error:e.message});
	}
}

 exports.categorylist = async(req,res,next)=>{
 	try{
 		let catList= await categoryModel.find({status:'active'}).select('_id name');
 		res.status(200).json({erro:false,data:catList});
 	}catch(err){
 		res.status(500).json({error: true,message:err.message});
 	}
}

exports.productlist = async(req,res,next)=>{
	try{
		if(!req.query.productname){
			req.query.productname='';
		}
		if(! req.query.productId){
			 req.query.productId='';
		}

		const limit= parseInt(req.query.limit?req.query.limit:10);
		const skip= req.query.skip?req.query.skip:0;

		await productModel.find({
			$and: [
    		    {productname: {$regex: '.*' +req.query.productname+".*"}},
    	  		{productId: {$regex: '.*' +req.query.productId+".*"}},
    	  		{status: "active"}
	      	]
		})
		.populate('categoryid','name')
		.sort({"createdAt":-1}).skip(skip).limit(limit)
		.then(result=>{
			res.status(200).json({error: false, data: result});
		}).catch(err=>{
			res.status(500).json({error: true, message:err.message});
		});

	}catch(e){
		res.status(500).json({error:true,error:e.message});
	}
}

exports.addSalesOrder = async(req,res,next)=>{

	try{
		let checksalesman = await salesmanModel.findOne({salesmanId:req.salemandata.salesmanId});

		let getProduct = await productModel.findOne({_id: req.body.productId}).select('price');
		if(!getProduct){
			res.status(404).json({error: true,message:"Product Id Not found"});
		}
		
		await new salesorderModel({
			productId: req.body.productId,
			quantity: req.body.quantity,
			totalamount:  (req.body.quantity* getProduct.price),
			salesmanId: checksalesman._id,
			retailerId: req.body.retailerId,
			distributorId: checksalesman.distributorId,
			quanitity:req.body.quantity
		}).save()
		.then(result=>{
			res.status(200).json({error: false,data:result})
		})
		.catch(err=>{
			res.status(500).json({error:true,error:err.message})
		});
	}catch(e){
		res.status(500).json({error:true,error:e.message});
	}
}


exports.salesOrderList = async(req,res,next)=>{
	try{
		let checksalesman = await salesmanModel.findOne({salesmanId:req.salemandata.salesmanId});

		const limit= parseInt(req.query.limit?req.query.limit:10);
		const skip= req.query.skip?req.query.skip:0;

		let checkSalesOrder = await salesorderModel.find({salesmanId:checksalesman._id})
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
		res.status(500).json({error:true,error:e.message});	
	}	
}

exports.addCollect = async(req,res,next)=>{
	try{
		let checkSO = await salesorderModel.findOne({_id:req.body.soId});
		if(!checkSO){
			res.status(400).json({error: true, error: "Sales order is not found"});
		}
		let checkColl = await collectModel.findOne({saleorderId:req.body.soId});

		var collStatus = 'pending';
		var soStatus = 'Collect amount';
		if(req.body.collectionAmount ==  checkSO.totalamount){
			var collStatus = 'collected';
			var soStatus =  'completed';
		}
		if(checkColl =='' || !checkColl){
			let pendingAmount = checkSO.totalamount - req.body.collectionAmount;

			let ins= await new collectModel({
				saleorderId:req.body.soId,
				collect:[{
					pendingAmount:pendingAmount,
					collectedAmount:req.body.collectionAmount
				}],
				collecType:[{
					type: req.body.collectionType,
					date: new Date()
				}],
				status: collStatus
			}).save();
			
			if(ins){
				let upd= await salesorderModel.findByIdAndUpdate(req.body.soId,{
					$set: {status:soStatus}
				},{new:true});
				
				if(upd){
					res.status(201).json({error: false, message: "Collection submitted",'Pending Amount': pendingAmount});
				}
			}
		}else{
			let pendingAmount = checkColl.collect['0'].pendingAmount - req.body.collectionAmount;
			let collectedAmount =Number(checkColl.collect['0'].collectedAmount) + Number(req.body.collectionAmount);
			let upd = await collectModel.findByIdAndUpdate(checkColl._id,{
				$set:{
					['collect.$[].pendingAmount'] : pendingAmount,
					['collect.$[].collectedAmount'] : collectedAmount,
					status: collStatus
				},
				$push:{
					collecType:{
					type: req.body.collectionType,
					date: new Date()
				}
				}
			}, {new: true});
			res.status(201).json({error: false, message: "Collection submitted",'Pending Amount': pendingAmount});

		}
	}catch(err){
		res.status(500).json({error:true,message:err.message});	
	}
}

exports.collectionList = async(req,res,next)=>{
	try{	
		let checksalesman = await salesmanModel.findOne({salesmanId:req.salemandata.salesmanId}).select('_id');

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
			}, 
			{
				$lookup:{
					from :"retailermodels",
					localField:"salorderColl.retailerId",
					foreignField:"_id",
					as : "retailerDet"  
				}
			},
			{
			    $unwind: "$retailerDet",
			},
		]).match({$and: [{ "salorderColl.salesmanId":checksalesman._id},{'status':collStatus}]})
		.project({_id:1,collect:1,collecType:1,status:1,createdAt:1,"salorderColl._id":1,"salorderColl.quantity":1,"retailerDet.name":1})
		.sort({"createdAt":-1})
		.skip(skip).limit(limit)
		.then((result) => {
			let data= result.map((getData)=>{
				return {
					_id:getData._id,
					collect: getData.collect,
					collecType: getData.collecType,
					status: getData.status,
					quantity: getData.salorderColl.quantity,
					retailername:getData.retailerDet.name
				}
			});
			
			let countObj = {};
			countObj['count'] = data.length; 
			
			data.push(countObj)
			res.json({error:false , data:data});
		})
		.catch((error) => {
			res.json({error:true ,err:error.message});
		});
		
	}catch(err){
		res.status().json({error:true,message: err.message});
	}
}