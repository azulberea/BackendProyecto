import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import passport from "passport"
import {fileURLToPath} from "url"

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import cookiesRouter from "./routes/cookiesRouter.js"
import sessionsRouter from "./routes/sessionsRouter.js"
import testRouter from "./routes/testRouter.js"
import __dirname from "./utils.js"
import initializatePassport from "./config/passportConfig.js"
import config from "./config/config.js"
import { sessionMiddleware } from "./middlewares/session.js"
import Sockets from "../socketServer.js"
// import errorHandler from "./middlewares/errorMiddleware.js"
import { addLogger, defineLogger } from "./utils/logger.js"

const { port, mongoUrl } = config

const app = express() 

export const httpServer = app.listen(port, () => {
    defineLogger.info(`Servidor activo en http://localhost:${port}`)
})

app.use(addLogger)
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
app.use("/api/test", testRouter)
// app.use(errorHandler)

const connection = async () => {

    try{

        await mongoose.connect(mongoUrl)
    
    }catch(error){

        defineLogger.fatal(`level FATAL at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

    }
}

connection()

const socketServer = new Server(httpServer)


socketServer.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
})

Sockets(socketServer)