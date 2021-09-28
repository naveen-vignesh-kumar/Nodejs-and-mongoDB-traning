const mongoose = require('mongoose');

const retailerSchema = mongoose.Schema({
	name : { type:String, required: true},
	storename: {type:String,required:true},
	retailerId: {type:String,required:true,unique:true},
	salesmanId : { type: mongoose.Schema.Types.ObjectId,  ref: "salesmanModel" },
	distId : { type: mongoose.Schema.Types.ObjectId,  ref: "distributorModel" },
	profileImage: [{type: String}],
	emailid: { type:String, required:true},
	phone: { type: Number, required: true },
	address: { type: String, required: true },
	status: { type: String, enum: ['active','deactive'],default:'deactive'}
},{
	timestamps:true,
});

module.exports = mongoose.model('retailerModel',retailerSchema);