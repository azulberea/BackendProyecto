import express from "express"
import { productManager } from "./productManager.js"

const app = express()

let instancia1 = new productManager
instancia1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", 25)
instancia1.addProduct("producto prueba 2", "Este es un producto prueba", 200, "Sin imagen", 25)
instancia1.addProduct("producto prueba 3", "Este es un producto prueba", 200, "Sin imagen", 25)
// console.log(instancia1.getProducts())

app.get("/", (req, res)=>{
    res.send("hola mundo")
})

app.get("/products", (req, res)=>{
    let products = instancia1.getProducts()
    if(!req.query){ 
        res.send(products)
        return
    }
    let { limit } = req.query
    let productsLimited = products.slice(0, limit)
    res.send(productsLimited)
})

app.get("/products/:productid", (req, res)=>{
    let productId = req.params.productid
    let productRequired = instancia1.getProductById(productId)
    res.send(productRequired)
})


const PORT = 8080

app.listen(PORT, ()=>{
    console.log(`server arctivo en http://localhost:${PORT}`)
})