import mongoose from "mongoose"
import { productModel } from "../models/productModel.js"
import { paginate } from "mongoose-paginate-v2"
import ProductService from "../services/productService.js"

export class ProductController {
    
    constructor() {

        this.prodService = new ProductService()

    }
    //OK
    async getProductsPaginated(filter, options){

        try{

            const result = await this.prodService.getAllPaginated(filter, options)

            if(result.docs.length == 0){

                console.log(`-PMDB no existen productos para mostrar`)

                return

            }

            console.log(`-PMDB productos paginados exitosamente ${typeof(result)}`)

            return result

        }catch(error) {

            return console.log(`PMDB CATCH hubo un error al paginar los productos: ${error.message}`)

        }
    }
    //OK
    async addProduct( title, description, price, stock, category, status, thumbnails ) { 

        if( !title || !description || !price || !stock || !category ){

            console.log(`-PMDB asegurate de completar todos los campos`)

            return 

        }

        try {
            
            const productExisting = await this.prodService.getByTitle(title)

            if(productExisting){

                console.log(`-PMDB el producto que estas intentando agregar ya existe`)

                return

            }

            const result = await this.prodService.add({
                title: title,
                description: description,
                price: price,
                stock: stock,
                category: category,
                status: status,
                thumbnails: thumbnails
            })
                
            console.log(`-PMDB producto creado correctamente ${result}`)

            return result

        } 
        catch(error) {

            console.log(`-PMDB CATCH hubo un error creando el producto: ${error.message}`)

        }
    }
    //OK
    async getProductByTitle(title) {

        try{

            const result = await this.prodService.getByTitle(title)

            if(!result){
                
                console.log("-PMDB no hay resultado")
                
                return 

            }

            console.log(`-PMDB ${result}`)

            return result

        }catch(error){

            return console.log(`-PMDB CATCH hubo un error obteniendo el producto por su titulo: ${error.message}`)

        }
    }
    //(FALTA TESTEAR PORQUE NO SE UTILIZA)
    async getProducts() {  

        try{

            const result = await this.prodService.getAll()

            if(result.length == 0){

                console.log(`-PMDB no hay productos existentes`)

                return

            }

            return result

        } 
        catch(error){

            return console.log(`-PMDB hubo un error obteniendo todos los productos: ${error.message}`)

        }

    }
    //OK
    async getProductById(id) {

        try {

            const result = await this.prodService.getById(id)

            if(!result){

                console.log(`-PMDB no existe un producto con ese id`)

                return

            }

            console.log(`-PMDB producto obtenido por su ID exitosamente`)

            return result

        }catch(error) {

            console.log(`-PMDB CATCH hubo un error obteniendo el producto  por su ID: ${error.message}`)

        }

    }
    //OK
    async updateProduct(id, update) {

        try{

            const result = await this.prodService.update(id, update)

            if(!result.acknowledged){

                console.log(`-PMDB no hubo modificaciones porque la modificacion es invalida`)

                return
                
            }

            if(result.matchedCount < 1){

                console.log(`-PMDB no hubo modificaciones porque no existe un producto con ese ID`)

                return 

            }

            return result

        }
        catch(error){

            console.log(`-PMDB CATCH hubo un error actualizando el producto`)

        }
    }
    //OK
    async deleteProduct(id){

        try{

            const result = await this.prodService.delete(id)

            if(!result.acknowledged){

                console.log(`-PMDB no se elimino ningun producto. intentelo de nuevo`)

                return

            }

            if(result.deletedCount < 1){

                console.log(`-PMDB no se pudo eliminar el producto, asegurate de que el producto a eliminar exista`)

                return

            }

            return result

        }
        catch(error){

            console.log(`PMDB CATCH hubo un error eliminando el producto`)
            
        }

    }

}

    export const productController = new ProductController


