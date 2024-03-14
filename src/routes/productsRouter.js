import { Router } from "express";
import { productManager } from "../productManager.js"

const router = Router()

export const PM = new productManager

router.get("/", (req, res)=>{

    let products = PM.getProducts()

    if(!req.query){ 
        res.status(200).send(products)
        return
    }

    let { limit } = req.query

    let productsLimited = products.slice(0, limit)

    res.status(200).send(productsLimited)
})

router.get("/:productid", (req, res)=>{
    
    let productId = req.params.productid
    
    let productRequired = PM.getProductById(productId)

    if(productRequired == "Not found"){
        return res.status(404).send({message: "no existe un producto con ese id"})
    }
    
    res.status(200).send(productRequired)
    
})

router.post("/", (req, res)=>{

    const {title, description, price, stock, category, thumbnails} = req.body

    if( !title || !description || !price || !stock || !category ){
        return res.status(400).send({message: "faltan campos. intentar nuevamente"})
    }

    if(req.body.id){
        return res.status(400).send({message: "el campo id se creara automaticamente. intentelo de nuevo sin incluir este campo"})
    }

    if(PM.validarProductoExistente(title)){
        return res.status(400).send({message: "producto ya existente"})
    }

    PM.addProduct( title, description, price, stock, category, thumbnails )

    res.status(201).send({message: "producto creado correctamente"});

})

//NO ANDA EL UPDATE PRODUCT: se modifica el producto pero no se sobreescribe MODIFICAR DSP
// router.put("/:productid", (req, res)=>{

//     const {campo, modificacion} = req.body

//     const productId = req.params.productid

//     const productoAModificar = PM.getProductById(productId)

//     if(productoAModificar == "Not found"){
//         return res.status(404).send({message: "no existe un producto con ese id"})
//     }

//     if(campo == "id"){
//         return res.status(404).send({message: "No se puede modificar ese campo del producto. Elija otro"})
//     }

//     if(!campo || !modificacion ){
//         return res.status(400).send({message: "Debes definir al menos un campo y su modificacion"})
//     }

//     PM.updateProduct(productId, productoAModificar, campo, modificacion)

//     res.status(200).send({message: "producto modificado correctamente"})

// })

//no funciona modoficar dsp
// router.delete("/:productid", (req, res)=>{

//     const productId = req.params.productid
//     const productRequired = PM.getProductById(productId)

//     if (productRequired == "Not found"){

//         return res.status(404).send({message: "No existe un producto con ese id"})

//     }

//     PM.deleteProduct(productRequired)
//     res.status(200).send({message: "Producto eliminado correctamente"})

// })

export default router