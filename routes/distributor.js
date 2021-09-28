const express = require('express');
const router = express.Router();

const authVal = require('../middleware/distAuth');

const { body, validationResult } = require('express-validator');
const distributorController = require('../controllers/distributorController');

const valSchema = require ('../middleware/validateDistSchema');

const valSalesmanSchema = require('../middleware/validationSalesmanSchema');

const valProductSchema = require('../middleware/validateProductSchema');

const valCategorySchema = require('../middleware/valCategorySchema');

const salesorderAddval = require("../middleware/salesorderAddval");

const valGenParams = require('../middleware/generalParams');



router.post('/register',valSchema.valRegistrationSchema,valGenParams,distributorController.register);
router.post('/login',valSchema.valLoginSchema,valGenParams,distributorController.login);

router.post('/addsalesman',authVal,valSalesmanSchema,valGenParams,distributorController.addSalesman);
router.get('/salesmanlist',authVal,distributorController.salesmanList);

router.post('/addproduct',authVal,valProductSchema,valGenParams,distributorController.addProduct);
router.post('/updateproduct',authVal,distributorController.updateProduct);
router.get('/productlist',authVal,distributorController.productList);

router.post('/addcategory',authVal,valCategorySchema,valGenParams,distributorController.addCategory);

router.get('/retailerlist',authVal,distributorController.retailerList);
router.put('/retailerstatus',authVal,distributorController.retailerStatus);

router.get('/salesorderlist',authVal,distributorController.salesOrderList);
router.put('/salesorderstatus',authVal,salesorderAddval.SOStatusDist,valGenParams,distributorController.updateSalesorderStatus);

router.get('/collectionlist',authVal,distributorController.collectionList);


module.exports = router;