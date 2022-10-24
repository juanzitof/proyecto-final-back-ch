require("dotenv").config()

const express = require("express");
const cookieParser = require("cookie-parser");
const cluster = require ("cluster");

const os = require("os");
const numCPU = os.cpus().length;

const routes = require("./src/routes/routes");
const chatRouter = require("./src/chat/router/messagesRouter");
const userRouter = require("./src/users/router/userRouter");
const productRouter = require("./src/products/router/productRouter");
const cartRouter = require("./src/carts/router/cartRouter");
const orderRouter = require("./src/orders/router/orderRouter");

const graphqlUsersRouter = require("./src/users/graphql/graphqlUserRouter");
const graphqlProductRouter = require("./src/products/graphql/graphqlProductRouter");
const graphqlCartsRouter = require("./src/carts/graphql/graphqlCartsRouter");
const graphqlOrdersRouter= require("./src/orders/graphql/graphqlOrdersRouter");
const graphqlChatRouter = require("./src/chat/graphql/graphqlChatRouter");

const app = express();

const http =  require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server (server);
const ioServer = require("./src/chat/ioServer/ioServer");

const reqInfo = require("./src/logs/info");
const { authenticateToken, isAdmin } = require("./src/middlewares/auth");

app.set("view-engine","ejs")

app.use(reqInfo)

app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use("/info", authenticateToken, isAdmin, routes.getInfo)
app.use(userRouter)
app.use(graphqlProductRouter)
app.use(graphqlChatRouter)
app.use(graphqlOrdersRouter)
app.use(graphqlUsersRouter)
app.use(graphqlCartsRouter)
app.use("/products",productRouter)
app.use("/cart", cartRouter)
app.use("/orders", orderRouter)
app.use("/chat", chatRouter)
app.use("/options", authenticateToken, isAdmin, routes.getOptions)

io.on('connection', (socket) => {
  socketServer(io, socket)
});

app.use(routes.error)

const PORT = process.env.PORT || 8080

if ( process.env.MODE == "cluster") {
  if(cluster.isPrimary) {
      for (let i = 0; i < numCPU; i++){
          cluster.fork()
      }
  } else {
      server.listen(PORT, () => {})
  }
} else {
  server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${server.address().port}`);
  })
}