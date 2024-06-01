import { productModel } from "../models/productModel.js";

export default class ProductService {

    async add(product){ 

        try {
            
            const result = await productModel.create(product)

            console.log(`-PRODUCTSERVICE producto ${result} creado correctamente`)

            return result
        
        }catch(error){

            return console.log(`-PRODUCTSERVICE error creando producto: ${error.message}`)

        }

    }

    async getByTitle(title){

        try{

            const result = await productModel.findOne({title: title})

            console.log(`-PRODUCTSERVICE producto obtenido por titulo: ${result}`)

            return result

        }catch(error){

            return console.log(`-PRODUCTSERVICE error obteniendo producto: ${error.message}`)

        }

    }

    async getAll(){

        try{

            const result = await productModel.find().lean()

            console.log(`-PRODUCTSERVICE productos obtenidos exitosamente: ${result}`)

            return result

        }catch(error){

            return console.log(`-PRODUCTSERVICE error obteniendo los productos: ${error.message}`)

        }

    }

    async getAllPaginated(filter, options){

        try{

            const result = await productModel.paginate(filter, options)

            console.log(`-PRODUCTSERVICE productos obtenidos exitosamente: ${result}`)

            return result

        }catch(error) {

            console.log(`-PRODUCTSERVICE CATCH hubo un error obteniendo todos los productos: ${error.message}`)

        }
    }

    async getById(id){

        try{

            const result = await productModel.findOne({_id: id})

            console.log(`-PRODUCTSERVICE producto obtenido por ID exitosamente: ${result}`)

            return result

        }catch(error){

            return console.log(`-PRODUCTSERVICE error obteniendo producto por su ID: ${error.message}`)

        }

    }

    async update(id, update){

        try{

            const result = await productModel.updateOne({_id: id}, update)

            console.log(`-PRODUCTSERVICE producto modificado correctamente: ${result}`)

            return result

        }catch(error) {

            return console.log(`-PRODUCTSERVICE error modificando el producto: ${error.message}`)

        }

    }

    async delete(id) {

        try{

            const result = await productModel.deleteOne({_id: id})

            console.log(`-PRODUCTSERVICE producto eliminado correctamente ${result}`)

            return result

        }catch(error) {

            return console.log(`-PRODUCTSERVICE error eliminando el producto: ${error.message}`)

        }

    }

}