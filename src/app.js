import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import passport from "passport"
import {fileURLToPath} from "url"
import jwt from "jsonwebtoken"

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import usersRouter from "./routes/usersRouter.js"
// import cookiesRouter from "./routes/cookiesRouter.js"
import sessionsRouter from "./routes/sessionsRouter.js"
import testRouter from "./routes/testRouter.js"
import __dirname from "./utils/dirnameUtils.js"
import initializatePassport from "./config/passportConfig.js"
import config from "./config/config.js"
import { sessionMiddleware } from "./middlewares/session.js"
import Sockets from "./socketServer.js"
import { addLogger, defineLogger } from "./utils/logger.js"
import hbs from "./utils/handlebarsUtils.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUiExpress from 'swagger-ui-express';

const { port, mongoUrl, jwtSecretKey } = config

const app = express() 

export const httpServer = app.listen(port, () => {
    defineLogger.info(`Servidor activo en http://localhost:${port}`)
})

app.use(addLogger)
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(express.static(`${__dirname}/../../public`));
app.use(cookieParser())
// app.use(sessionMiddleware)

initializatePassport()
app.use(passport.initialize())
// app.use(passport.session())

app.engine("handlebars", hbs.engine)
app.set("views", `${__dirname}/../views`)
app.set("view engine", "handlebars")


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/users", usersRouter)
app.use("/", viewsRouter)
// app.use("/cookies", cookiesRouter)
app.use("/api/test", testRouter)

const swaggerOptions = {
    definition: {
        openApi: "3.0.1",
        info: {
            title: "Beyond supplements",
            description: "API pensada para utilizar como e-commerce de suplementos deportivos"
        }
    },
    apis: [`./src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

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
    // sessionMiddleware(socket.request, socket.request.res || {}, next);
    const token = socket.request.headers.cookie ? socket.request.headers.cookie.split('=')[1] : null;

    if (token) {
        
        jwt.verify(token, jwtSecretKey, (err, decoded) => {

            if (err) {

                return next(new Error("Authentication error"))

            }
            
            socket.user = decoded

            next()
        })

    } else {
        
        next(new Error('No token provided'));
        
    }
})

Sockets(socketServer)
