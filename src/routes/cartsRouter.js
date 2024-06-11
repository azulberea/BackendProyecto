import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import ticketModel from "../dao/models/ticketModel.js";

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
        
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al crear el carrito"
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
                status: "error",
                message:"Hubo un error añadiento el producto al carrito. Asegurate de que existe un carrito y un producto con ese ID"})

        }

        return res.status(200).send({
            status: "success",
            message:`El producto ${productId} fue añadido correctamente al carrito ${cartId}`})

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: "Hubo un error al agregar el producto al carrito"
        })
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

            return res.status(500).send({
                status: "error",
                message: "Hubo un error al obtener los productos del carrito"
            })

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
        
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al obtener los productos del carrito"
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
                status: "error",
                message:"Hubo un error al eliminar el producto del carrito. Asegurese de que exista un carrito y un producto con esos ID"
            })

        }

        return res.status(200).send({
            status: "success",
            message: "Producto eliminado del carrito exitosamente"
        })

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: `Hubo un error al eliminar el producto del carrito: ${error.message}`
        })

    }

})

router.delete("/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    try{

        const result = await cartController.deleteAllProductsFromCart(cartId)

        if(!result){

            return res.status(400).send({
                status: "error",
                message:"Hubo un error al intentar eliminar todos los productos del carrito. Asegurese de que exista un carrito con ese ID"
            })

        }

        return res.status(200).send({
            status: "success",
            message: "Todos los productos han sido eliminados del carrito"
        })

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: `Hubo un error al eliminar los productos del carrito: ${error.message}`
        })

    }

})

router.put("/:cartid/products/:productid", async (req, res)=>{

    const cartId = req.params.cartid

    const productId = req.params.productid

    const { quantity } = req.body

    try{

        const result = await cartController.updateProductQuantity(cartId, productId, quantity)

        if(!result){

            return res.status(400).send({
                status: "error",
                message: "Hubo un error al actualizar el producto. Asegurate de que los ID correspondan a un carrito y producto existentes"})

        }

        if(result.modifiedCount == 0){

            return res.status(500).send({
                status: "error",
                message: "Hubo un error al actualizar el producto"
            })

        }

        return res.status(200).send({
            status: "success",
            message:"Se ha actualizado el carrito correctamente"})

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: `Hubo un error al actualizar el producto: ${error.message}`
        })

    }

})

router.post("/:cartid/purchase", async (req, res) => {

    try{

        const ticket = {
            
        }

        const result = await ticketModel.create(ticket)

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: `Hubo un error al realizar la compra: ${error.message}`
        })

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