import express from 'express'
import checkUserAuth from '../middleware/auth-middleware.js';
import {getOrdersByCustomerName,createOrder} from '../controllers/orderController.js'

const router = express.Router();

//middleware
router.use('/postorder',checkUserAuth)
router.use('/getOrdersByustomerName/:customerName',checkUserAuth)


router.post('/postorder',createOrder)
router.get('/getOrdersByCustomerName/:customerName',getOrdersByCustomerName)

export default router