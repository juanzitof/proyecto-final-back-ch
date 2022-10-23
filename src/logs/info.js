const logger = require("./logger");

const info = ( req, res, next )=> {
  logger.info(`Ruta: ${req.originalUrl} Método: ${req.method}`)
  next ()
}

module.exports = info;