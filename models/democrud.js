const mongoose = require('mongoose');

const democrud = mongoose.Schema({
	productname:{type:String,require:true},
	productprice:{type:Number,require:true},
	tagsname: [],
	keyword:[{}]
});

module.exports = mongoose.model('democrud',democrud);