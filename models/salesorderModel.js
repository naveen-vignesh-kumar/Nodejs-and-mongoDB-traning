const mongoose = require('mongoose');

const salesorderSchema = mongoose.Schema({
	productId : { type: mongoose.Schema.Types.ObjectId,  ref: "productModel" },
	quantity :{type: Number, required:true},
	totalamount :{type: Number, required: true},
	distributorId : { type: mongoose.Schema.Types.ObjectId,  ref: "distributorModel" },
	salesmanId : { type: mongoose.Schema.Types.ObjectId,  ref: "salesmanModel" },
	retailerId : { type: mongoose.Schema.Types.ObjectId,  ref: "retailerModel" },
	status: { type: String, enum: ['Inprogress','Approved','Reject', 'Package is moving','Delivered','Collect amount','deactive','completed'],default:'deactive'}
},{
	timestamps:true,
});

module.exports = mongoose.model('salesorderModel',salesorderSchema);