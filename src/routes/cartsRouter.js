import { Router } from "express";
import moment from "moment";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken"

import { cartController } from "../controllers/cartController.js";
import { ticketController } from "../controllers/ticketController.js";
import { passportCall } from "../utils/passportUtils.js";
import { roleAuth } from "../middlewares/auth.js";
import config from "../config/config.js";

const router = Router()

const { jwtSecretKey } = config

router.post("/", async (req, res) => { 

    try{
        
        const result = await cartController.createCart()

        if(!result){

            return res.status(500).send({
                status: "Error",
                payload: "Hubo un error al crear el carrito :("
            })

        }

        return res.status(201).send({
            status: "Success",
            payload: `${result}`
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.post("/:cartid/products/:productid", async (req, res)=>{ 
        
    const productId = req.params.productid

    const cartId = req.params.cartid

    try{

        const result = await cartController.addProductToCart(productId, cartId)

        if(!result){

            return res.status(400).send({
                status: "Error",
                payload: `Error obteniendo producto ${productId} o carrito ${cartId}`
            })

        }

        return res.status(200).send({
            status: "Success",
            payload:`El producto ${productId} fue añadido correctamente al carrito ${cartId}`
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/", async (req, res)=>{ 

    try{

        const result = await cartController.getAllCarts()

        if(!result){

            return res.status(500).send({
                status: "Error",
                payload:"Hubo un error al obtener los carritos"
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: result
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/:cartid", async (req, res)=>{ 
    const cartId = req.params.cartid

    try{

        const result = await cartController.getAllCartProducts(cartId, false)

        if(!result){

            return res.status(400).send({
                status: "Error",
                payload: `Hubo un error obteniendo los productos del carrito ${cartId}`
            })

        }

        if(result == "empty"){

            return res.status(200).send({
                status: "Success",
                payload: result
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: `${result.products[0]}`
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }
})

router.delete("/:cartid/products/:productid", async (req, res)=>{ 

    const cartId = req.params.cartid

    const productId = req.params.productid

    try{

        const result = await cartController.deleteProductFromCart(productId, cartId)

        if(!result){

            return res.status(400).send({
                status: "Error",
                payload: `Hubo un error. Asegurate de que el producto no pertenezca al propietario del carrito y que el producto ${productId} o el carrito ${cartId} existan `
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: result
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.delete("/:cartid", async (req, res)=>{ 

    const cartId = req.params.cartid

    try{

        const result = await cartController.deleteAllProductsFromCart(cartId)

        if(!result){

            return res.status(400).send({
                status: "Error",
                payload: `Hubo un error eliminando los productos del carrito ${cartId}`
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: result
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.put("/:cartid/products/:productid", async (req, res)=>{ //EN DESUSO

    const cartId = req.params.cartid

    const productId = req.params.productid

    const { quantity } = req.body

    try{

        const result = await cartController.updateProductQuantity(cartId, productId, quantity)

        if(!result){

            return res.status(400).send({
                status: "Error",
                payload: `No se pudo actualizar el producto ${productId} en el carrito ${cartId}`
            })
        }

        if(result.modifiedCount == 0){

            req.logger.warning(`No se pudo actualizar el producto ${productId} del carrito ${cartId}`)

            return res.status(500).send({
                status: "Error",
                payload: `Error interno el intentar actualizar el producto ${productId} del carrito ${cartId}`
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: result
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.post("/:cartid/purchase", async (req, res) => { 

    const cartId = req.params.cartid

    const { purchaser } = req.body

    try{

        const result = await ticketController.addTicket(cartId, purchaser)

        if(!result){

            return res.status(500).send({
                status: "Error",
                payload: "No se pudo generar el ticket de compra"
            })

        }

        const ticket = await ticketController.getTicket(result._id)

        let purchaseToken = jwt.sign(ticket, jwtSecretKey, {expiresIn: "10m"})

        res.cookie("purchaseToken", purchaseToken, {
            maxAge: 600000,
            httpOnly: true
        }).send({
            status: "Success",
            payload: ticket
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({
            status: "Error",
            payload: error.message
        })

    }
})

// router.put("/:cartid", async (req, res)=>{ NO FUNCIONA, IGUAL PENSABA ELIMINAR ESTA RUTA PORQUE NO ME PARECE MUY UTIL

//     const cartId = req.params.cartid

//     const {products} = req.body 

//     try{

//         const result = await cartController.updateCartProducts(cartId, products)

//         if(!result){

//             return res.status(400).send({
//                 status: "Error",
//                 message:"Hubo un error al actualizar el carrito. Asegurese de que exista un carrito con ese ID"
//             })

//         }

//         if(result.modifiedCount == 0){
            
//             return res.status(400).send({
//                 status: "Error",
//                 message: "Hubo un error al actualizar el carrito"
//             })

//         }

//         return res.status(200).send({
//             status: "Success",
//             message:`Carrito actualizado correctamente`
//         })

//     }catch(error){

//         req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
//         message: ${error.message}`)

//         return res.status(500).send({status: "Error",
//             payload: error.message
//         })

//     }

// })



export default router