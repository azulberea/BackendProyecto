import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { createProduct } from "../utils/functionUtils.js";
import moment from "moment";
// import CustomError from "../services/errorService/CustomError.js";
// import { addProductErrorInfo, idErrorInfo } from "../services/errorService/info.js";
// import EErrors from "../services/errorService/enums.js";

const router = Router()

router.get("/", async (req, res) => {

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
                status:"success",
                message:"No existen productos para mostrar"
            })
        }

        return res.status(200).send({status:"success",
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

        console.log(error)

        return res.send(error)

    }

})

router.get("/product/:productid", async (req, res) => {

    let productId = req.params.productid

    try{

        let result = await productController.getProductById(productId)

        if(!result) {

            // CustomError.createError({
            //     name: "Error getting product",
            //     cause: idErrorInfo(productId),
            //     message: "Error trying to get product",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })
            
            req.logger.error(`level ERROR at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: no existe un producto con ese ID`)

            return  res.status(404).send({status: "error",
                message: "no existe un producto con ese ID"
            })

        }

        return res.status(200).send({status: "success", result})

    }catch(error){

        req.logger.error(`level ERROR at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.send(error.message)

    }

})

router.post("/", async (req, res) => {
    
    const { title, description, price, stock, category, status, thumbnails } = req.body
    
    try{

        const result = await productController.addProduct( title, description, price, stock, category, status, thumbnails )

        if(!result){

            // CustomError.createError({
            //     name: "Product creation error",
            //     cause: addProductErrorInfo({title, description, price, stock, category}),
            //     message: "Error trying to add product",
            //     code: EErrors.INVALID_TYPES_ERROR
            // })

            return 
        }

        return res.status(201).send({
            status: "success",
            message: "Producto creado correctamente"
        })

    }catch(error){

        console.log(error)

        return res.status(500).send(error)

    }

})

router.put("/product/:productid", async (req, res) => {

    const productId = req.params.productid

    const update = req.body

    try{

        const result = await productController.updateProduct(productId, update)

        if(!result){
            
            return res.status(400).send({
                status:"error",
                message:"Hubo un error modificando el producto. Asegurate de que exista un producto con ese ID y que el campo sea valido"
            })

        }

        return res.status(200).send({
            message:"El producto ha sido modificado correctamente", result
        })

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: error.message
        })

    }

})

router.delete("/product/:productid", async (req, res) => {

    const productId = req.params.productid

    try{

        const result = await productController.deleteProduct(productId)

        if(!result){
            
            // CustomError.createError({
            //     name: "Error getting product",
            //     cause: idErrorInfo(productId),
            //     message: "Error trying to get product",
            //     code: EErrors.INEXISTENT_RESOURCE
            // })

            return
        }

        return res.status(200).send({
            status: "success",
            message: "Producto eliminado correctamente"
        })

    }catch(error){

        return res.status(500).send({
            status: "error",
            message: error.message
        })

    }
})

//PRUEBA OK
router.get("/title/:title", async (req, res) => {

    const { title } = req.params

    try{

        const result = await productController.getProductByTitle(title)

        if(!result){

            return res.status(400).send("No hay productos con ese nombre")
        }

        return res.status(200).send(result)

    }catch(e){

        return res.status(404).send({status: "error",
            message: e.message
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
            status: "success",
            products: products
        })

    }catch(error){

        return res.status(500).send({
            status:error,
            message: error.message
        })

    }
})
export default router