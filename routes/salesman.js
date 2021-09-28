const express = require('express');
const router = express.Router();
const salesmanController = require('../controllers/salesmanController');

const salesmanLoginVal = require("../middleware/salesmanLoginVal");
const generalParams = require("../middleware/generalParams");

const retailerAddval = require("../middleware/retailerAddval");
const salesorderAddval = require("../middleware/salesorderAddval");

const salesmanAuth = require("../middleware/salesmanAuth");


router.post('/login',salesmanLoginVal,generalParams,salesmanController.login);

router.post('/addretailer',salesmanAuth,retailerAddval,generalParams,salesmanController.addRetailer);
router.get('/retailerlist',salesmanAuth,salesmanController.retailerList);


router.get('/productlist',salesmanAuth,salesmanController.productlist);
router.get('/categorylist',salesmanAuth,salesmanController.categorylist);

router.post('/addsalesorder',salesmanAuth,salesorderAddval.Addaleorderval,generalParams,salesmanController.addSalesOrder);
router.get('/salesorderlist',salesmanAuth,salesmanController.salesOrderList);

router.post('/addcollect',salesmanAuth,salesorderAddval.Addcollectionval,generalParams,salesmanController.addCollect);
router.get('/collectionlist',salesmanAuth,salesmanController.collectionList);

module.exports = router;