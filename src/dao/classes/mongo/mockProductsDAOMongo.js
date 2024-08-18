import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../../../utils/logger.js";
import { mockProductModel } from "../../models/mockProductModel.js";

export default class MockProductService {

    async add(product){ 

        try{

            const result = await mockProductModel.create(product)

            return result 

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async get(){

        try{

            const result = await mockProductModel.find()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }
    
}