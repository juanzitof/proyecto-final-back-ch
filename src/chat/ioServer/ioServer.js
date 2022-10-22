const MessagesService = require("../service/MessagesService");
const service = new MessagesService (process.env.DATA_BASE_MESSAGES)

const ioServer = async ( io, socket) => {
    socket.emit("messages", await ServiceWorker.getAllMessages())
    socket.on("new_message", async ( message ) => {
        console.log("Mensaje nuevo!");
        await service.addMessage(message)
        io.sockets.emit("messages", await service.getAllMessages())
      })
}

module.exports = ioServer;