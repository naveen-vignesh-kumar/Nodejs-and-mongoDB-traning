const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	productname: {type: String, required: true, unique: true},
	productId: {type: String, required: true, unique: true},
	price: {type: Number, required: true },
	stock: [{
		totalstock: {type: Number, required: true},
		unit : { type: String, required: true},
		pieces :{type: String, required: true}
	}],
	description: {type: String, required: true},
	categoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'categoryModel', required: true},
	status: {type: String, enum: ['active','deactive'],default: 'active' ,required: true}
	},{
		timestamps: true
	});

module.exports = mongoose.model('productModel',productSchema);