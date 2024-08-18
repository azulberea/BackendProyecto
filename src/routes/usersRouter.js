import passport from "passport";
import moment from "moment";
import jwt from "jsonwebtoken"
import {fileURLToPath} from "url"
import {Router} from "express"

import config from "../config/config.js";
import { passportCall } from "../utils/passportUtils.js";
import { roleAuth } from "../middlewares/auth.js";
import { userController } from "../controllers/userController.js";
import { createHash } from "../utils/functionUtils.js";
import userModel from "../dao/models/userModel.js";
import userDTO from "../dao/dto/userDTO.js";

const router = Router()

router.get("/", async(req, res) => {

    try{

        const users = await userController.getAllUsers()

        const usersMainData = users.map( user => {
            return new userDTO(user)
        })

        return res.status(200).send({
            status: "Success",
            payload: usersMainData
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/info", passportCall("jwt"), roleAuth("all"), async (req, res) => {

    try{

        return res.status(200).json(req.user)

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }
})

router.put("/premium/:uid", async (req, res) => {

    try{

        const userId = req.params.uid

        const result = await userController.updateMembership(userId)

        if(result.modifiedCount == 0){
            return res.status(400).send({status: "Error",
                payload: "No se pudo acutalizar tu membresia"
            })
        }
        
        const updatedUser = await userController.getUserById(userId)

        return res.status(200).send({status: "Success",
            payload: updatedUser
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.put("/inactiveUsers", async (req, res) => {

    try{

        const result = await userController.inactivateUsers()

        if(!result.acknowledged){

            return res.status(500).send({
                status: "Error",
                message: "Hubo un error actualizando el estado de los usuarios."
            })
        }

        return res.status(200).send({
            status: "Success",
            message: `Se han desactivado ${result.modifiedCount} usuarios.`
        })

    }catch(error){

            req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
})

router.delete("/:uid", async (req, res) => {

    try{

        const userId = req.params.uid

        const result = await userController.deleteUser(userId)

        if(!result){

            return res.status(500).send({
                status: "Error",
                message: "Hubo un error y no se pudo eliminar al usuario"
            })

        }
        
        res.status(200).send({
            status: "Success",
            payload: result
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

}) 

export default router