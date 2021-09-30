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


/**
 * @swagger
 * components:
 *   schemas:
 *     distributorModel:
 *       type: object
 *       required:
 *         - distname
 *         - distId
 *         - emailId
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         distname:
 *           type: string
 *           description: The distname
 *         distId:
 *           type: string
 *           description: The distId
 *         emailId:
 *           type: string
 *           description: The emailId
 *         password:
 *           type: string
 *           description: The password
 *         activation:
 *           type: string
 *           description: The activation 
 *       example:
 *         id: d5fE_asz
 *         distname: John
 *         distId: DIST1234
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     salesmanModel:
 *       type: object
 *       required:
 *         - name
 *         - salesmanId
 *         - distributorId
 *         - emailid
 *         - password
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         salesmanId:
 *           type: string
 *           description: The salesmanId
 *         distributorId:
 *           type: string
 *           description: The distributorId
 *         emailId:
 *           type: string
 *           description: The emailId
 *         password:
 *           type: string
 *           description: The password it will saved as hash 
 *         status:
 *           type: string
 *           description: The status 
 *       example:
 *         id: d5fE_asz
 *         distributorId: De23345$@
 *         emailId: email@gmail.com
 *         password: WER12345$234234
 *         status: active
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     salesmanModel:
 *       type: object
 *       required:
 *         - name
 *         - salesmanId
 *         - distributorId
 *         - emailid
 *         - password
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         salesmanId:
 *           type: string
 *           description: The salesmanId
 *         distributorId:
 *           type: string
 *           description: The distributorId
 *         emailId:
 *           type: string
 *           description: The emailId
 *         password:
 *           type: string
 *           description: The password it will saved as hash 
 *         status:
 *           type: string
 *           description: The status 
 *       example:
 *         id: d5fE_asz
 *         distributorId: De23345$@
 *         emailId: email@gmail.com
 *         password: WER12345$234234
 *         status: active
 */



/**
 * @swagger
 * /distributor/register:
 *   post:
 *     summary: Create a new book
 *     tags: [register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/distributorModel'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/distributorModel'
 *       500:
 *         description: Some server error
 */


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