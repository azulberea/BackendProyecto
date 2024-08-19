import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../utils/logger.js";
import ProductService from "../dao/classes/mongo/productDAOMongo.js"
import { userController } from "../controllers/userController.js"

export class ProductController {
    
    constructor() {

        this.prodService = new ProductService()

    }
    //OK
    async getProductsPaginated(filter, options){

        try{

            const result = await this.prodService.getAllPaginated(filter, options)

            if(result.docs.length == 0){

                defineLogger.info(`level INFO at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No hay productos para mostrar`)

                return

            }

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }
    //OK
    async addProduct( title, description, price, stock, category, status, owner, thumbnails ) { 

        try {
            
        if( !title || !description || !price || !stock || !category ){

            defineLogger.info(`level INFO at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: No se creo el producto porque falta completar uno o mas campos}`)

            return

        }
            
        const productExisting = await this.prodService.getByTitle(title)

        if(productExisting){

            defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: No se creo el producto porque ya existe`)

            return

        }

        const productOwner = await userController.getUserByEmail(owner)

        if(!productOwner || !productOwner.premium){

            defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: Para crear el producto debes tener una cuenta registrada en nuestra base de datos y ser premium`)

            return

        }
        
        const result = await this.prodService.add({
                title,
                description,
                price,
                stock,
                category,
                status,
                owner: owner ?? "adminCoder@coder.com", 
                thumbnails: thumbnails
            })

            return result

        } 
        catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }
    //OK
    async getProductByTitle(title) {

        try{

            const result = await this.prodService.getByTitle(title)

            if(!result){
                
                defineLogger.info(`level INFO at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No existe el producto ${title}`)
                
                return 

            }

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }
    //(FALTA TESTEAR PORQUE NO SE UTILIZA)
    async getProducts() {  

        try{

            const result = await this.prodService.getAll()

            if(result.length == 0){

                defineLogger.info(`level INFO at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No hay productos existentes`)

                return result

            }

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }
    //OK
    async getProductById(id) {

        try {

            const result = await this.prodService.getById(id)

            if(!result){
                
                defineLogger.info(`level INFO at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No existe un producto con ese id (${id})`)

                return

            }

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }
    //OK
    async updateProduct(id, update) {

        try{

            const result = await this.prodService.update(id, update)

            if(!result.acknowledged){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No hubo cambios porque la modificacion es invalida`)

                return

            }

            if(result.matchedCount < 1){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No hubo modificaciones porque no existe un producto con ese id (${id})`)

                return 

            }

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }
    //OK
    async deleteProduct(id){

        try{

            const result = await this.prodService.delete(id)

            if(!result.acknowledged){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No se ha podido eliminar el producto (${id})`)

                return

            }

            if(result.deletedCount < 1){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No sepudo eliminar el producto (${id})`)

                return

            }

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async refreshStock(id, quantity){

        try{

            const result = await this.updateProduct(id,{ $inc: { stock: -quantity } })

            return result

        }catch(error) {

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }

}

    export const productController = new ProductController


