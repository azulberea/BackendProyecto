import moment from "moment-timezone";
import { fileURLToPath } from "url";

import { defineLogger } from "../utils/logger.js";
import userModel from "../dao/models/userModel.js";
import UserService from "../dao/classes/mongo/userDAOMongo.js";
import { cartController } from "./cartController.js";
import config from "../config/config.js";
import { transport } from "../utils/nodemailerUtils.js";

const { senderEmail } = config

export class UserController {

    constructor() {

        this.userService = new UserService()

    }

    // async addGithubUser(user){

    //     try{

    //         const result = await this.userService.add(user)

    //         return result

    //     }catch(error){

    //         defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
    //         message: ${error.message}`)

    //         return null
            
    //     }

    // }

    async addUser(first_name, last_name, email, age, password, role, premium) {

        if( !email || !password ){

            defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: No se creo el usuario porque faltan completar campos`)

            return null

        }

        try {

            const userExisting = await userModel.findOne({email: email})

            if(userExisting){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No se creo el usuario porque ese email ya esta asociado a uno existente`)

                return null 

            }

            const user = {
                first_name,
                last_name,
                email,
                age, 
                password,
                role,
                premium,
                cart: email != "adminCoder@coder.com" ? await cartController.createCart() : null
            }

            const result = await this.userService.add(user)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getUserByEmail(email) {

        try{

            const result = await this.userService.getByEmail(email)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getAllUsers() {

        try{

            const result = this.userService.getAll()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getUserObjectByEmail(email) {

        try{

            const result = await this.userService.getObjectByEmail(email)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getUserById(id) {

        try{

            const result = this.userService.getById(id)

            return result 

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async updatePassword(userId, password) {

        try{

            const user = this.userService.getById(userId)

            const result = this.userService.update(userId, {password})

            return result


        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async updateMembership(userId) {

        try{

            const user = await this.userService.getById(userId)

            const newMembership = !user.premium

            const result = await this.userService.update(userId, { premium:  newMembership  } )

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async logout(userId) {

        try{

            const timeZone = moment.tz('America/Argentina/Buenos_Aires')
            const utcOffset = timeZone.utcOffset()
            const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000)

            const result = await this.userService.update(userId, { last_connection: lastConnection})

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async inactivateUsers() {

        try{

            const timeZone = moment().tz('America/Argentina/Buenos_Aires')

            const utcOffset = timeZone.utcOffset()
    
            const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000)
    
            const twoDaysAgo = new Date(lastConnection.getTime() - 2 * 24 * 60 * 60 * 1000)
    
            const inactiveUsers = await this.userService.get({ last_connection: { $lte: twoDaysAgo } })
    
            const result = await this.userService.inactivateUsers({ last_connection: { $lte: twoDaysAgo } })

            for(const user of inactiveUsers){

                await transport.sendMail({
                    from: `Beyond Supplements <${senderEmail}>`,
                    to: user.email,
                    subject: "Desactivacion de tu cuenta",
                    html: ` <div>
                                <h1>Se ha desactivado tu cuenta</h1>
                                <p>Han pasado dos dias desde tu ultima conexion y tu cuenta ha sido desactivada por inactividad.</p>
                            </div>`
                })
        
            }

            return result    
            
        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async getInactiveUsers() {

        try{

            const result = this.userService.get({status: false})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async deleteUser(userId) {

        try{

            const result = await this.userService.delete(userId)

            if(!result) {

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: Hubo un error al eliminar el usuario`)

            return 

            }
            console.log(result, "controller")
            
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

export const userController = new UserController()