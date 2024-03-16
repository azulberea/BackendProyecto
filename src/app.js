import express from "express"
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{

    res.status(200).send("Hola mundo")

})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

const PORT = 8080

app.listen(PORT, () => {

    console.log(`server arctivo en http://localhost:${PORT}`)
    
})