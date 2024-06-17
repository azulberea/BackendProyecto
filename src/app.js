import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import passport from "passport"

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import cookiesRouter from "./routes/cookiesRouter.js"
import sessionsRouter from "./routes/sessionsRouter.js"
import __dirname from "./utils.js"
import { productController } from "./controllers/productController.js"
import { cartController } from "./controllers/cartController.js"
import initializatePassport from "./config/passportConfig.js"
import config from "./config/config.js"
import { sessionMiddleware } from "./middlewares/session.js"
import Sockets from "../socketServer.js"
import errorHandler from "./middlewares/errorMiddleware.js"

const { port, mongoUrl } = config

const app = express() 

export const httpServer = app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`)
})


app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(express.static(`${__dirname}/../public`));
app.use(cookieParser())
app.use(sessionMiddleware)


initializatePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")



app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/", viewsRouter)
app.use("/cookies", cookiesRouter)
app.use(errorHandler)

const connection = async () => {

    try{

        await mongoose.connect(mongoUrl)
    
    }catch(error){

        console.error(error)

    }
}

connection()

const socketServer = new Server(httpServer)


socketServer.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
})

Sockets(socketServer)