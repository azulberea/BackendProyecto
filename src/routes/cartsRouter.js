import { Router } from "express";
import { cartManager } from "../dao/Dao/cartManagerFS.js";

const router = Router()

let CM = new cartManager

router.post("/", (req, res) => {

    const {products} = req.body

    const carrito = CM.createCart(products)

    res.status(200).send({message: `carrito creado correctamente`})

})

router.post("/:cartid/product/:productid", (req, res)=>{

    const cartId = req.params.cartid

    const productId = req.params.productid

    CM.addProductToCart(productId, cartId) == "Not found" ?
        res.status(404).send({message:"No existe un carrito o un producto con ese id. Intentelo de nuevo"}) :
        res.status(200).send({message:"el producto fue añadido al carrito correctamente"})

})

router.get("/", (req, res)=>{

    const carts = CM.getCarts()

    res.status(200).send(carts)

})

router.get("/:cartid", (req, res)=>{

    const cartId = req.params.cartid

    const products = CM.getCartProducts(cartId)

    products == "Not found" ?
        res.status(404).send({message: "No existe un carrito con ese id"}) :
        res.status(200).send(products)

})

export default router