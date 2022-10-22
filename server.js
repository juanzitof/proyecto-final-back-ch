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

const graphqlUsersRouter = require("./src/users/graphql/graphqlUserRouter");
const graphqlProductRouter = require("./src/products/graphql/graphqlProductRouter");
const graphqlCartsRouter = require("./src/carts/graphql/graphqlCartsRouter");
const graphqlOrdersRouter= require("./src/orders/graphql/graphqlOrdersRouter");
const graphqlChatRouter = require("./src/chat/graphql/graphqlChatRouter");

const app = express();

const http =  http.createServer('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server (server);
const ioServer = require("./src/chat/socket.io/ioServer");
