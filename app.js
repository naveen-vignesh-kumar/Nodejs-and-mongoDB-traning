const express = require('express');
const app = express();
require('dotenv').config()
var mongoose = require('mongoose');
const distributorRouter = require('./routes/distributor');
const salesmanRouter = require('./routes/salesman');
const port = 3000;

app.use(express.json())
app.use('/distributor',distributorRouter);
app.use('/salesman',salesmanRouter);
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true}).then((res)=>{
	console.log('connect on db');
}).catch((err)=>{
	console.log(err);
});


app.listen(port,()=>{
	console.log(`Server running ${port}`);
});

