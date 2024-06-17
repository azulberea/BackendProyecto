import { mockProductModel } from "../../models/mockProductModel.js";

export default class MockProductService {

    async add(product){ 

        try{

            const result = await mockProductModel.create(product)

            return result 

        }catch(error){

            console.log(error.message)

            return null

        }

    }

    async get(){

        try{

            const result = await mockProductModel.find()

            return result

        }catch(error){

            console.log(error.message)

            return null

        }

    }
    
}