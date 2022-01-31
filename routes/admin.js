import express from 'express'
import adminControllers from '../controllers/admin.js'

const router = express.Router()

router.get('/add-product',adminControllers.getAddProduct)

router.get('/products',adminControllers.getProducts)

router.post('/add-product',adminControllers.postAddProduct)

router.get('/edit-product/:productId',adminControllers.getEditProduct)

router.post('/edit-product',adminControllers.postEditProduct)

router.post('/delete-product',adminControllers.postDeleteProduct)

export default router
