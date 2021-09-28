const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	name: {type: String, required: true, unique:true},
	status: {type: String, enum: ['active','deactive'], default: 'active',required: true}
},{
	timestamps: true
});

module.exports = mongoose.model('categoryModel',categorySchema);