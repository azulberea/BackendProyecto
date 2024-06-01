import { Router } from "express";
import { productController } from "../dao/Dao/productController.js";
import { productModel } from "../dao/models/productModel.js";

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

    }catch(error) {

        return res.status(500).send({
            status: "error",
            message: error.message
        })

    }

})

router.get("/:productid", async (req, res) => {

    let productId = req.params.productid

    try{

        let result = await productController.getProductById(productId)

        if(!result) {

            return res.status(404).send({message: "No existe un producto con ese id"})

        }

        return res.status(200).send({status: "success", result})

    }catch(error){

        return res.status(500).send({status:"error",
            message: error.message
        })

    }

})

router.post("/", async (req, res) => {
    
    const { title, description, price, stock, category, status, thumbnails } = req.body
    
    try{

        const result = await productController.addProduct( title, description, price, stock, category, status, thumbnails )

        if(!result){

            return res.status(400).send({
                status:"error",
                message:"Hubo un error al crear el producto. Asegurate de haber completado todos los campos y que el producto no exista en la base de datos"
            })

        }

        return res.status(201).send({message: "Producto creado correctamente"})

    }catch(error){
        
        return res.status(500).send({
            status: "error",
            message:"Hubo un error creando el producto"
        })

    }

})

router.put("/:productid", async (req, res) => {

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

router.delete("/:productid", async (req, res) => {

    const productId = req.params.productid

    try{

        const result = await productController.deleteProduct(productId)

        if(!result){

            return res.status(400).send({
                status: "error",
                message: "Hubo un error al intentar eliminar el producto. Asegurate de que el ID proporcionado coincida con el de un producto existente"
            })

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

export default router