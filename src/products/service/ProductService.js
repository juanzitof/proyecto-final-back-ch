const ProductDaoFactory = require("../daos/DaoFactoryProduct");
const logger = require("../../logs/logger");

const daoFactory = ProductDaoFactory.getInstance()

class ProductService{
  constructor(type){
    this.products = daoFactory.create(type)
  }

  async getAllProducts () {
    try {
      return await this.products.getAllProducts()
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async findProduct (id) {
    try {
      const idNumber = parseInt(id)
      if(isNaN(idNumber)) return {error: "Id debe ser un numero"}
      return await this.products.findProduct(id)
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async getProductsByCategory(category){
    try {
      return await this.products.filterByCategory(category)
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async addProduct (product) {
    try {
      return await this.products.addProduct(product)
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async modifyProductById(id, productUpdate){
    try {
      const response = await this.products.modifyProductById(id,productUpdate)
      if (!response.matched) return {error: `No existe producto con ese id: ${id}`}
      if (!response.modified) return {error: `La actualizacion del producto es el mismo!`}
      productUpdate.id = id
      return productUpdate
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async deleteProduct (id) {
    try {
      const response = await this.products.deleteProduct(id)
      if (response.deleted) {
        return "Producto eliminado con exito!"
      } else {
        return `No hay productos con el  id: ${id}`
      }
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }

  async deleteAllProducts () {
    try {
      await this.products.deleteAllProducts()
    } catch (err) {
      logger.error(`Error: ${err}`)
    }
  }
}

module.exports = ProductService;