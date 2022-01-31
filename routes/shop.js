import express from 'express'
import shopControllers from '../controllers/shop.js'

const router = express.Router()

router.get('/', shopControllers.getIndex)

router.get('/products', shopControllers.getProducts)

router.get('/products/:productId', shopControllers.getProduct)

router.get('/cart',shopControllers.getCart)

router.post('/cart',shopControllers.postCart)

router.post('/cart-delete-item',shopControllers.postCartDeleteProduct)

router.get('/orders',shopControllers.getOrders)

router.post('/create-order', shopControllers.postOrder)

export default router
