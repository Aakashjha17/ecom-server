import express from 'express'
import {createProduct,getProductById,getAllProducts} from '../controllers/productController.js'

const router = express.Router();

router.post('/postproduct',createProduct)
router.get('/getProductById/:id',getProductById)
router.get('/getAllProducts',getAllProducts)

export default router
