const OrderDaoFactory = require("../daos/DaoFactoryOrder");
const logger = require("../../logs/logger");

const daoFactory = OrderDaoFactory.getInstance()

const CartService = require("../../carts/service/CartService");
const cartService = new CartService(process.env.DATA_BASE_CARTS);
const UserService = require("../../users/service/UserService");
const userService = new UserService(process.env.DATA_BASE_USERS);

const {sendEmailNewOrder} = require("../../nodemailer/helpers/helpers")

class OrderService {
  constructor(type) {
    this.orders = daoFactory.create(type)
  }

  async createNewOrder(user) {
    try{
      const cart = await cartService.getCart(user.currentCartId);
      const order = {
        email: user.email,
        products: cart.products,
        shippingAddress: cart.shippingAddress,
        total:cart.total,
        date: new Date(),
        status: "generated"
      }
      const orderGenerated = await this.orders.createNewOrder(order)
      if(orderGenerated) {
        await cartService.deleteCart(user.currentCartId)
        const newIdCart = await cartService.createCart(user.email, user.address)
        await userService.updateCurrentCartId(user.email, newIdCart)
        sendEmailNewOrder(process.env.GMAIL_ADMIN, process.env.GMAIL_RECIEVER, order)
        return orderGenerated.id
      }
      return {error: "Error al procesar la compra!"}
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async getOrderById( id ) {
    try {
      const orderId = parseInt(id);
      if(isNaN(orderId)) return {error: "Id debe ser un numero!"}
      return await this.orders.getOrderById(orderId)
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async deleteOrderById(id) {
    try {
      if( isNaN( parseInt(id) )) return {error: "Id debe ser un numero!"}
      const response = await this.orders.deleteOrderById(id)
      if (response.deleted) {
        return "Pedido eliminado con existo!"
      } else {
        return `No hubo pedidos con el id: ${id}`
      }
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }
}

module.exports = OrderService;