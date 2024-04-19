import { Router } from "express";
import { CMDB } from "../dao/Dao/cartManagerDB.js";

const router = Router()

router.post("/", async (req, res) => {

    try{
        
        const result = await CMDB.createCart()

        if(!result){

            return res.status(400).send({message: "Hubo un error al crear el carrito :("})

        }

        return res.status(200).send({message: `Carrito creado correctamente: ${result}`})

    }catch(error){
        
        console.error(error.message)

    }

})

router.post("/:cartid/products/:productid", async (req, res)=>{
        
    const productId = req.params.productid

    const cartId = req.params.cartid

    try{

        const result = await CMDB.addProductToCart(productId, cartId)

        if(!result){

            return res.status(400).send({message:"Hubo un error añadiento el producto al carrito. Asegurate de que existe un carrito y un producto con ese ID"})

        }

        return res.status(200).send({message:`El producto ${productId} fue añadido correctamente al carrito ${cartId}`})

    }catch(error){

        console.error(error.message)

    }

})

router.get("/", async (req, res)=>{

    try{

        const result = await CMDB.getCarts()

        if(!result){

            return res.status(400).send({message:"Hubo un error al obtener los carritos"})

        }

        return res.status(200).send({carts: result})

    }catch(error){

        console.error(error.message)

    }


})

router.get("/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    try{

        const result = await CMDB.getAllCartProducts(cartId)

        if(!result){

            return res.status(400).send({message: "Hubo un error al obtener el carrito. Asegurate de que existe un carrito con ese ID"})

        }

        return res.status(200).send({cart: cartId, products: result})

    }catch(error){
        
        console.error(error.message)
        
    }
})

router.delete("/:cartid/products/:productid", async (req, res)=>{ 

    const cartId = req.params.cartid

    const productId = req.params.productid

    try{

        const result = await CMDB.deleteProductFromCart(productId, cartId)

        if(!result){

            return res.status(400).send({message:"Hubo un error al eliminar el producto del carrito. Asegurese de que exista un carrito y un producto con esos ID"})

        }

        return res.status(200).send({message: result})


    }catch(error){

        console.error(error.message)

    }

})

router.delete("/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    try{

        const result = await CMDB.deleteAllProductsFromCart(cartId)

        if(!result){

            return res.status(400).send({message:"Hubo un error al intentar eliminar todos los productos del carrito. Asegurese de que ese ID corresponda a un carrito"})

        }

        return res.status(200).send({message: "Todos los productos han sido eliminados del carrito"})

    }catch(error){

        console.error(error.message)

    }

})

router.put("/:cartid/products/:productid", async (req, res)=>{

    const cartId = req.params.cartid

    const productId = req.params.productid

    const { quantity } = req.body

    try{

        const result = await CMDB.updateProductQuantity(cartId, productId, quantity)

        if(!result){

            return res.status(400).send({message: "Hubo un error al actualizar el producto. Asegurate de que los ID correspondan a un carrito y producto existentes"})

        }

        return res.status(200).send({message:"Se ha actualizado el carrito correctamente"})

    }catch(error){

        console.error(error.message)

    }

})

router.put("/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    const {products} = req.body 

    try{

        const result = await CMDB.updateCartProducts(cartId, products)

        if(!result){

            return res.status(400).send({message:"Hubo un error al actualizar el carrito. Intentelo de nuevo"})

        }

        return res.status(200).send({message:"Carrito actualizado correctamente", result: result})

    }catch(error){

        console.error(error.message)

    }

})

export default router