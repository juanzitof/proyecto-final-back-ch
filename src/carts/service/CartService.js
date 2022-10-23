const CartDaoFactory = require("../daos/DaoFactoryCarts");
const ProductService = require("../../products/service/ProductService")
const products = new ProductService(process.env.DATA_BASE_PRODUCTS)
const logger = require("../../logs/logger");

const daoFactory = CartDaoFactory.getInstance();

class CartService {
  constructor(type){
    this.carts = daoFactory.create(type)
  }

  async getCart (id){
    try {
      return await this.carts.getCartById(parseInt(id))
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }
  
  async createCart (email, shippingAddress){
    try {
      const cart = {
        email:email,
        date: new Date(),
        products:[],
        shippingAddress: shippingAddress,
        total:0
      }
      const cartCreated = await this.carts.createCart(cart)
      return cartCreated.id
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async addProductToCart ( idCart, idProduct, quantity ){
    try {
      let product = (await products.findProduct(idProduct))
      if (!product) return `Producto con id:${idProduct} no encontrado`
      const productToAdd = {...product.toObject(), quantity:quantity}
      let cart = await this.carts.getCartById(idCart)
      const alreadyInCart = cart.products.find(product => product.id == idProduct)
      if(alreadyInCart) return "El producto ya existe en el carrito!"
      cart.products.push(productToAdd)
      cart.total = cart.products.reduce((accum, product) => accum += product.price * product.quantity, 0)
      const response = await this.carts.modifyCart(idCart,cart)
      if (!response.matched) return `No existe carrito con el ${idcart}`
      return "Producto agregado con existo!"
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async deleteProductFromCart (idCart, idProduct){
    try {
      let cart = await this.carts.getCartById(idCart)
      const productsList = cart.products.filter(product => product.id !== parseInt(idProduct))
      cart.products = productsList
      cart.total = cart.products.reduce((accum, product) => accum += product.price * product.quantity, 0)
      const response = await this.carts.modifyCart(idCart, cart)
      if (!response.matched) return `No existe carrito con el  ${idCart}`
      if (!response.modified) return `No hay ningun producto con el id:${idProduct} en el carrito`
      return "Producto eliminado con exito!"
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async deleteCart (id){
    try {
      const response = await this.carts.deleteCart(id)
      if (!response.deleted) return `No hay carritos con id: ${id}`
      return `Carrito con id: ${id} elimando con exito!`
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

}

module.exports = CartService;