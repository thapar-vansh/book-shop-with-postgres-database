import Product from '../models/product.js'
import Order from '../models/order.js'



let getProducts = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render('shop/product-list.ejs', {
        prods: product,
        pageTitle: 'All products',
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

let getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findAll({ where: { id: prodId } }) //can also use finBYPk()
    .then((product) => {
      res.render('shop/product-detail.ejs', {
        product: product[0],
        pageTitle: product[0].title,
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

let getIndex = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render('shop/index.ejs', {
        prods: product,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((err) => console.log(err))
}
let getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

let postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));  
}

let postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

let getCheckout = (req, res, next) => {
  //   res.render('shop/checkout.ejs', {
  //     path: '/checkout',
  //     pageTitle: 'Checkout',
  //   })
}

let postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

let getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

export default {
  getIndex: getIndex,
  getProducts: getProducts,
  getCart: getCart,
  postCart: postCart,
  getCheckout: getCheckout,
  getOrders: getOrders,
  getProduct: getProduct,
  postOrder:postOrder,
  postCartDeleteProduct: postCartDeleteProduct,
}
