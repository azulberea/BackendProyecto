import { Router } from "express";
import { productManager } from "../productManager.js"

const router = Router()

export const PM = new productManager

router.get("/", (req, res) => {

    let products = PM.getProducts()

    if(!req.query){

        res.status(200).send(products)

        return

    }

    let { limit } = req.query

    let productsLimited = products.slice(0, limit)

    res.status(200).send(productsLimited)

})

router.get("/:productid", (req, res) => {

    let productId = req.params.productid

    let productRequired = PM.getProductById(productId)

    productRequired == "Not found" ?

        res.status(404).send({message: "No existe un producto con ese id"}) :

        res.status(200).send(productRequired)

})

router.post("/", (req, res) => {

    const { title, description, price, stock, category, thumbnails } = req.body

    if( !title || !description || !price || !stock || !category ) {

        return res.status(400).send({message: "Faltan campos. Intente nuevamente"})

    }

    if(req.body.id) {

        return res.status(400).send({message: "El campo ID se creara automaticamente. Intentelo de nuevo sin incluir este campo"})

    }

    if(PM.validarProductoExistente(title)) {

        return res.status(400).send({message: "Producto ya existente"})

    }

    PM.addProduct( title, description, price, stock, category, thumbnails )

    res.status(201).send({message: "Producto creado correctamente"});

})

router.put("/:productid", (req, res) => {

    const {campo, modificacion} = req.body

    const productId = req.params.productid

    const productoAModificar = PM.getProductById(productId)

    if(productoAModificar == "Not found") {

        return res.status(404).send({message: "No existe un producto con ese id"})

    }

    if(campo == "id") {

        return res.status(404).send({message: "No se puede modificar ese campo del producto. Elija otro"})

    }

    if(!campo || !modificacion ) {

        return res.status(400).send({message: "Debes definir un campo y su modificacion"})

    }

    if(campo in productoAModificar){
    
        PM.updateProduct(productId, productoAModificar, campo, modificacion)

        res.status(200).send({message: "Producto modificado correctamente"})

    }else {

        res.status(404).send({message: "No existe ese campo. Ingrese uno diferente"})

    }

})


router.delete("/:productid", (req, res) => {

    const productId = req.params.productid

    const productRequired = PM.getProductById(productId)

    if(productRequired == "Not found") {

        return res.status(404).send({message: "No existe un producto con ese id"})

    }

    PM.deleteProduct(productId)

    res.status(200).send({message: "Producto eliminado correctamente"})

})

export default router