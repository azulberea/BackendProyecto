import { Router } from "express";
import { cartManager } from "../cartManager.js";
import { productManager } from "../productManager.js";
import { PM } from "../routes/productsRouter.js"

const router = Router()
let CM = new cartManager

router.post("/", (req, res)=>{

    const {products} = req.body

    const carrito = CM.createCart(products)

    res.status(200).send({message: `carrito creado correctamente`})
})

router.post("/:cartid/product/:productid", (req, res)=>{

    const cartId = req.params.cartid
    const productId = req.params.productid

    CM.addProductToCart(productId, cartId)

    res.status(200).send({message:"el producto fue añadido al carrito correctamente"})

})

router.get("/", (req, res)=>{

    const carts = CM.getCarts()

    res.status(200).send(carts)
})

router.get("/:cartid", (req, res)=>{

    const cartId = req.params.cartid

    const products = CM.getCartProducts(cartId)

    if(products == "Not found"){
        return res.status(404).send({message: "No existe un carrito con ese id"})
    }

    return res.status(200).send(products)

})

export default router