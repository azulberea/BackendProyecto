import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import ticketModel from "../dao/models/ticketModel.js";
import moment from "moment";
import { ticketController } from "../controllers/ticketController.js";
// import CustomError from "../services/errorService/CustomError.js";
// import { idErrorInfo } from "../services/errorService/info.js";
// import EErrors from "../services/errorService/enums.js";

const router = Router()

router.post("/", async (req, res) => {

    try{
        
        const result = await cartController.createCart()

        if(!result){

            return res.status(500).send({
                status: "error",
                message: "Hubo un error al crear el carrito :("
            })

        }

        return res.status(201).send({
            status: "success",
            message: `Carrito creado correctamente: ${result}`})

    }catch(error){

        console.log(error)

        return res.send(error)

    }

})

router.post("/:cartid/products/:productid", async (req, res)=>{
        
    const productId = req.params.productid

    const cartId = req.params.cartid

    try{

        const result = await cartController.addProductToCart(productId, cartId)

        if(!result){

            // CustomError.createError({
            //     name: "Error getting resource",
            //     cause: idErrorInfo(productId, cartId),
            //     message: "Error trying to get product or cart requires",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })
return
        }

        return res.status(200).send({
            status: "success",
            message:`El producto ${productId} fue añadido correctamente al carrito ${cartId}`})

    }catch(error){

        console.log(error)

        return res.send(error)

    }

})

router.get("/", async (req, res)=>{

    try{

        const result = await cartController.getAllCarts()

        if(!result){

            return res.status(500).send({
                status: "error",
                message:"Hubo un error al obtener los carritos"})

        }

        return res.status(200).send({
            status: "success",
            message: `Carritos: ${result}`
        })

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: "Hubo un error al obtener los carritos"
        })

    }


})

router.get("/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    try{

        const result = await cartController.getAllCartProducts(cartId)

        if(!result){

            // CustomError.createError({
            //     name: "Error getting cart",
            //     cause: idErrorInfo(cartId),
            //     message: "Error trying to get cart",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })
            return

        }

        if(result == "empty"){

            return res.status(200).send({
                status: "success",
                message: "El carrito esta vacío"
            })

        }

        return res.status(200).send({
            status: "success",
            message: `Productos del carrito ${cartId} obtenidos exitosamente: ${result.products}`
        })

    }catch(error){

        console.log(error)

        return res.send(error)

    }
})

router.delete("/:cartid/products/:productid", async (req, res)=>{ 

    const cartId = req.params.cartid

    const productId = req.params.productid

    try{

        const result = await cartController.deleteProductFromCart(productId, cartId)

        if(!result){

            // CustomError.createError({
            //     name: "Error getting resources",
            //     cause: getProductByIdErrorInfo(productId, cartId),
            //     message: "Error trying to get resources",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })
            return

        }

        return res.status(200).send({
            status: "success",
            message: "Producto eliminado del carrito exitosamente"
        })

    }catch(error){

        console.log(error)

        return res.send(error)

    }

})

router.delete("/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    try{

        const result = await cartController.deleteAllProductsFromCart(cartId)

        if(!result){

            // CustomError.createError({
            //     name: "Error getting cart",
            //     cause: getProductByIdErrorInfo(cartId),
            //     message: "Error trying to get cart",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })
            return

        }

        return res.status(200).send({
            status: "success",
            message: "Todos los productos han sido eliminados del carrito"
        })

    }catch(error){

        console.log(error)

        return res.send(error)

    }

})

router.put("/:cartid/products/:productid", async (req, res)=>{

    const cartId = req.params.cartid

    const productId = req.params.productid

    const { quantity } = req.body

    try{

        const result = await cartController.updateProductQuantity(cartId, productId, quantity)

        if(!result){

            // CustomError.createError({
            //     name: "Error getting resource",
            //     cause: iddErrorInfo(productId, cartId),
            //     message: "Error trying to get resource",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })
            return
        }

        if(result.modifiedCount == 0){

            // CustomError.createError({
            //     name: "Internal server error",
            //     cause: getProductByIdErrorInfo(id),
            //     message: "Unacknowledged changes",
            //     code: EErrors.INTERNAL_SERVER_ERROR
            // })
            return

        }

        return res.status(200).send({
            status: "success",
            message:"Se ha actualizado el carrito correctamente"})

    }catch(error){

        console.log(error)

        return res.send(error)

    }

})

router.post("/:cartid/purchase", async (req, res) => {

    const cartId = req.params.cartid

    const {purchaser} = req.body

    try{

        const result = await ticketController.addTicket(cartId, purchaser)

        return res.status(200).send({
            result
        })

    }catch(error){

        console.log(error)

        return res.send(error)

    }
})

router.put("/:cartid", async (req, res)=>{ //NO FUNCIONA, IGUAL PENSABA ELIMINAR ESTA RUTA PORQUE NO ME PARECE MUY UTIL

    const cartId = req.params.cartid

    const {products} = req.body 

    try{

        const result = await cartController.updateCartProducts(cartId, products)

        if(!result){

            return res.status(400).send({
                status: "error",
                message:"Hubo un error al actualizar el carrito. Asegurese de que exista un carrito con ese ID"
            })

        }

        if(result.modifiedCount == 0){
            
            return res.status(400).send({
                status: "error",
                message: "Hubo un error al actualizar el carrito"
            })

        }

        return res.status(200).send({
            status: "success",
            message:`Carrito actualizado correctamente`
        })

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: `Hubo un error al actualizar los productos del carrito: ${error.message}`
        })

    }

})



export default router