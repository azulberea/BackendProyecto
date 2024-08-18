import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../../../utils/logger.js";
import { productModel } from "../../models/productModel.js";

export default class ProductService {

    async add(product){ 

        try {
            
            const result = await productModel.create(product)

            return result
        
        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getByTitle(title){

        try{

            const result = await productModel.findOne({title: title})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getAll(){

        try{

            const result = await productModel.find().lean()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getAllPaginated(filter, options){

        try{

            const result = await productModel.paginate(filter, options)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getById(id){

        try{

            const result = await productModel.findOne({_id: id})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async update(id, update){

        try{

            const result = await productModel.updateOne({_id: id}, update)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async delete(id) {

        try{

            const result = await productModel.deleteOne({_id: id})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

}