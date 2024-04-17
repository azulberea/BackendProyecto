import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import __dirname from "./utils.js"
import { PMDB } from "./dao/Dao/productManagerDB.js"

const app = express()

const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`)
})

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/../public`));

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

const connection = async () => {
    try{
        await mongoose.connect("mongodb+srv://444zul:qweqweasd123123@cluster0.yaz7f4a.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    }catch(error){
        console.error(error)
    }
}

connection()

//REFACTORIZAR EN SCRIPT APARTE
socketServer.on("connection", socket => {

    console.log("nuevo cliente conectado")
    
    socket.on("addProduct", async (data) => {

        const result = await PMDB.addProduct(...data)

        if(!result){
            
            socket.emit("errorOnCreation", "Hubo un error al crear el producto. Asegurate de haber llenado todos los campos con datos validos y que el producto no exista en la base de datos")

            return

        }

        const products = await PMDB.getProducts()

        socket.emit("getProducts", products)
        
    })

    socket.on("deleteProduct", async (data) => {

        await PMDB.deleteProduct(data)

        const products = await PMDB.getProducts()

        socket.emit("getProducts", products)
    })

})

