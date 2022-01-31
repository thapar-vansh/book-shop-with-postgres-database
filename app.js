import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import sequelize from './util/database.js'
import Product from './models/product.js'
import User from './models/user.js'
import Cart from './models/cart.js'
import CartItem from './models/cart-item.js'
import Order from './models/order.js'
import OrderItem from './models/order-item.js'



const app = express()

import adminRoutes from './routes/admin.js'
import shopRoutes from './routes/shop.js'
import errController from './controllers/products.js'

app.use(
  cors({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
)

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.resolve('public')))

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => {
      console.log(err)
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errController.get404)

Product.belongsTo(User)
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

sequelize.sync()

  //sequelize.sync({ force: true })
  .then((result) => {
    //console.log('created product')
    return User.findByPk(1)
  })
  // .then(user =>{
  //   if(!user){
  //     return User.create({name:"Vansh",email:"vansh@sixergame.com"})
  //   }
  //   return user
  // })
  .then((user) => {
    //console.log(user)
    return user.createCart()
  })
  .then((cart) => {
    app.listen(3000)
  })
  .catch((err) => console.log(err))
