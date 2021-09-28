const mongoose = require('mongoose');

const salesmanSchema = mongoose.Schema({
	name : { type:String, required: true, trim: true },
	salesmanId : { type: String, required: true, unique:true },
	distributorId: { type: mongoose.Schema.Types.ObjectId,  ref: "distributorModel" },
	profileImage: [{type: String}],
	emailid: { type:String, required:true, unique:true },
	password: { type: String, required: true },
	status: { type: String, enum: ['active','deactive'],default:'deactive'}
},{
	timestamps:true,
});

module.exports = mongoose.model('salesmanModel',salesmanSchema);