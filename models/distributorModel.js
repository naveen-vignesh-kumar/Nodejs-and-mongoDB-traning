const mongoose = require('mongoose');

const distributorSchema = mongoose.Schema({
	distname: {type:String , required: true},
	distId: {type: String , required: true, unique: true},
	emailId: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	activation: {type:String, enum:['active','deactive'],default: 'deactive'},
	},{
        timestamps: true,
    }
    );

module.exports = mongoose.model('distributorModel',distributorSchema);