const mongoose = require('mongoose');

const collectSchema = mongoose.Schema({
	saleorderId : { type: mongoose.Schema.Types.ObjectId, ref: 'salesorderModel', required: true},
	collect: [{
			pendingAmount: {type: Number, required: true},
			collectedAmount : {type: Number, required: true}
		}],
	collecType:[{
		type: {type: String, required: true},
		date: {type: Date}
	}],
	status: {type: String, enum: ['pending','collected','active'],default: 'active' ,required: true}
	},{
		timestamps: true
	});

module.exports = mongoose.model('collectModel',	collectSchema);