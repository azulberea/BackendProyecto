import moment from "moment";
import {fileURLToPath} from "url"

import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { createProduct } from "../utils/functionUtils.js";
import { transport } from "../utils/nodemailerUtils.js";
import config from "../config/config.js";

const {senderEmail } = config
const router = Router()

router.get("/", async (req, res) => {  //EN DESUSO

    let { limit, page, sort, category, status } = req.query

    let sortOptions 

    if(sort == "asc"){

        sortOptions = {price:1}

    }else if(sort == "desc") {

        sortOptions={price:-1}

    }else{

        sortOptions = {}

    }

    let filter  
    
    if(category) {

        filter = {category:category}

    }else if(status) {

        filter = {status:status}

    }else {

        filter = {}
            
    }

    try{

        let result = await productController.getProductsPaginated(filter,{limit:limit ? limit : 10, page:page ? page : 1, sort: sortOptions})

        if(!result){

        return res.status(200).send({
                status:"Success",
                payload:"No existen productos para mostrar"
            })

        }

        return res.status(200).send({status:"Success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : null,
            nextLink: result.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : null
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/product/:productid", async (req, res) => { //EN DESUSO

    let productId = req.params.productid

    try{

        let result = await productController.getProductById(productId)

        if(!result) {

            return  res.status(404).send({status: "Error",
                payload: "no existe un producto con ese ID"
            })

        }

        return res.status(200).send({status: "Success", 
            payload: result})

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.post("/", async (req, res) => { //EN DESUSO. PROBAR SI PUEDO ITULIZARLA EN EL FORM DE ADD PRODUCT
    
    const { title, description, price, stock, category, status, owner, thumbnails } = req.body
    
    try{

        const result = await productController.addProduct( title, description, price, stock, category, status, owner, thumbnails )

        if(!result){
                
            req.logger.warning(`Hubo un error al intentar crear el producto`)

            return  res.status(400).send({status: "Error",
                payload: "Hubo un error al crear el producto. Asegurate de que todos los campos sean validos o intentalo de nuevo mas tarde"
            })

        }

        return res.status(201).send({
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

router.put("/product/:productid", async (req, res) => { //EN DESUSO

    const productId = req.params.productid

    const update = req.body

    try{

        const result = await productController.updateProduct(productId, update)

        if(!result){
            
            return res.status(400).send({
                status:"Error",
                payload:"Hubo un error modificando el producto. Asegurate de que exista un producto con ese ID y que el campo sea valido"
            })

        }

        const updatedProduct = await productController.getProductById(productId)

        return res.status(200).send({status: "Success",
            payload: updatedProduct
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.delete("/product/:productid", async (req, res) => {

    const productId = req.params.productid

    try{

        const productToDelete = await productController.getProductById(productId)

        const owner = productToDelete.owner

        const result = await productController.deleteProduct(productId)

        if(!result){

            req.logger.warning(`No se pudo eliminar el producto. Asegurate de que exista un producto con ese ID`)

            return res.status(400).send({
                status: "Success",
                payload: "No se pudo eliminar el producto. Asegurate de que exista un producto con ese ID"
            })

        }

        await transport.sendMail({
            from: `Beyond Supplements <${senderEmail}>`,
            to: owner,
            subject: "Producto eliminado",
            html: ` <div>
                        <h1>Uno de tus productos ha sido eliminado</h1>
                        <p>Se ha eliminado tu producto "${productToDelete.title}" de nuestro catálogo. Para mas informacion contactanos. </p>
                    </div>`
        })

        return res.status(200).send({
            status: "Success",
            payload: "Producto eliminado correctamente"
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/title/:title", async (req, res) => { //EN DESUSO

    const { title } = req.params

    try{

        const result = await productController.getProductByTitle(title)

        if(!result){

            return res.status(404).send({status: "Error",
                payload: "No existen productos con ese nombre"
            })

        }

        return res.status(200).send({status: "Success",
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

router.get("/mockingproducts", async (req, res) => {

    try{

        let products = []

        for (let i = 0; i < 50; i++) {
            await products.push(createProduct())
        }

        return res.status(200).send({
            status: "Success",
            payload: products
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }
})
export default router