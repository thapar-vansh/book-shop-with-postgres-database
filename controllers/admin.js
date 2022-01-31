import Product from '../models/product.js'

let getAddProduct = (req, res, next) => {
  res.render('admin/edit-product.ejs', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

let postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then((result) => {
      console.log('CREATED PRODUCT')
      res.redirect('/admin/products')
    })
    .catch((err) => console.log(err))
}

let getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      const product = products[0]
      if(!product){
      res.redirect('/')
      }
      else{
        res.render('admin/edit-product.ejs', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
        })
      }
    })
    .catch(err=>{
      console.log(err)
    })
}

let postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedimageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDesc = req.body.description
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedimageUrl,
    updatedPrice,
    updatedDesc
  )  
  Product.findByPk(prodId)
  .then((product) => {
    product.title = updatedTitle
    product.price = updatedPrice
    product.description = updatedDesc
    product.imageUrl = updatedimageUrl
    return product.save()
  })
  .then((result) => {
    console.log('UPDATED PRODUCT')
    res.redirect('/admin/products')
  })
  .catch((err) => console.log(err))

}

let getProducts = (req, res, next) => {
Product.findAll()
.then((products) => {
    res.render('admin/products.ejs', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products.ejs',
    })
  })
  .catch((err) => console.log(err))
}


let postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findByPk(prodId) //also by Product.destroy({where:})
    .then((product) => {
      return product.destroy()
    })
    .then((result) => {
      console.log('DESTROYED PRODUCT')
      res.redirect('/admin/products')
    })
    .catch((err) => console.log(err))
}

export default {
  postAddProduct: postAddProduct,
  getAddProduct: getAddProduct,
  getProducts: getProducts,
  getEditProduct: getEditProduct,
  postEditProduct: postEditProduct,
  postDeleteProduct: postDeleteProduct,
}
