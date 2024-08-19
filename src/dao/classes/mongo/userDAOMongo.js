import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../../../utils/logger.js";
import userModel from "../../models/userModel.js";

export default class UserService {

    async add(user) {

        try{
            
            const result = await userModel.create(user)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }
    // async addFromGithub(user) {

    //     try{



    //     }catch(error){

    //         defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
    //         message: ${error.message}`)

    //         return null

    //     }
    // }
    async getByEmail(email) {

        try{

            const result = await userModel.findOne({email:email})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getObjectByEmail(email) {

        try{

            const result = await userModel.findOne({email:email}).lean()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getById(id) {

        try{

            const result = await userModel.findById(id)

            return result 

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
        
    }

    async get(filter) {

        try{

            const result = userModel.find(filter)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async getAll() {

        try{

            const result = await userModel.find()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async update(id, update) {

        try{

            const result = await userModel.updateOne({_id: id}, update)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async inactivateUsers(filter) {

        try{

            const result = await userModel.updateMany(filter, {status: false})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }
    
    async delete(userId) {

        try{

            const result = userModel.findByIdAndDelete(userId)

            return result

        }catch(error){

        defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

    }
}