import passport from "passport";
import moment from "moment";
import jwt from "jsonwebtoken"
import {fileURLToPath} from "url"
import { Router } from "express";
import crypto from "crypto"
import bcrypt from "bcrypt"

import config from "../config/config.js";
import { passportCall } from "../utils/passportUtils.js";
import { roleAuth } from "../middlewares/auth.js";
import { transport } from "../utils/nodemailerUtils.js";
import { userController } from "../controllers/userController.js";
import { createHash } from "../utils/functionUtils.js";




const { jwtSecretKey, senderEmail } = config

const router = Router()

router.post("/register",
    passport.authenticate("register", {session: false, failureRedirect: "/register?redirected=true" }),    
    async (req, res)=> {

    try{

        if(!req.user){

            return res.status(400).redirect("/register?redirected=true")

        }

        return res.redirect("/login")
        
    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }
    
})

router.post("/login", 
    passport.authenticate("login", {session: false, failureRedirect: "/login?redirected=true" }),
    async (req, res) => {

    try{

        if(!req.user) {

            return res.status(401).send({
                status: "Error",
                message: "login error"
            })

        }

        let token = jwt.sign(req.user, jwtSecretKey, {expiresIn: "24h"})

        res.cookie("authToken", token, {
            maxAge: 60*60*1000,
            httpOnly: true
        }).redirect("/profile")

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            message: error.message
        })

    }
})

router.post("/logout", passportCall("jwt"), async (req, res)=>{
    
    try{
        console.log(req.user)

        await userController.logout(req.user._id)

        res.cookie("authToken", " ", {
            httpOnly: true,
            expires: new Date(0)
        }).redirect("/")

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }


})


router.get("/current", passportCall("jwt"), roleAuth("all"), async (req, res) => {

    try{

        return res.status(200).send({
            status:"Success",
            payload: req.user
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.post("/restoreEmail", async (req, res) => {

    const { email } = req.body

    try{

        if(!email){

            return res.status(400).send({status: "Error",
                message: "Debes introducir un email"
            })

        }
        
        const user = await userController.getUserByEmail(email)

        if(!user){

            return res.status(400).send({status: "Error",
                payload: "No existe un usuario asociado a ese mail en nuestra base de datos"
            })

        }

        const restoreId = crypto.randomBytes(20).toString('hex')
        
        let token = jwt.sign({userId: user._id, restoreId}, jwtSecretKey, {expiresIn: "15m"})

        const result = await transport.sendMail({
            from: `Beyond Supplements <${senderEmail}>`,
            to: email,
            subject: "Restauracion de contraseña",
            html: ` <div>
                        <h1>Restauracion de contraseña</h1>
                        <p>Se ha solicitado un reestablecimiento de contraseña. <a href="https://beyond-supplements.onrender.com/confirmPasswordRestore/${restoreId}">Has click aquí</a> para ser redirigido al sitio y reestablecer tu contraseña. Si no has solicitado un reestablecimiento, por favor ignora este mail</p>
                    </div>`
        })

        if(!result){

            return res.status(500).send({status: "Error",
                payload: "Hubo un error al enviar el mail de reestablecimiento. Intentelo de nuevo"
            })

        }

        return res.cookie("restoreToken", token, {
            maxAge:  900000,
            httpOnly: true
        }).send({status:"Success",
            payload: "Se ha enviado el email"
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.post("/confirmPasswordRestore/:restoreId", async (req, res) => {

    const { newPassword } = req.body

    try{

        if(req.cookies.authToken){ 

            return res.redirect("/profile")
            
        }   

        const restoreToken = req.cookies.restoreToken
        
        if(!restoreToken){

            return res.status(400).send({ status: "Error",
                payload: "El token no existe o expiró. Vuelve a solicitar una restauracion de contraseña"
            })
        }

        const decoded = jwt.verify(restoreToken, jwtSecretKey)

        const userId = decoded.userId

        const user = await userController.getUserById(userId)

        
        if(bcrypt.compareSync(newPassword, user.password)) {

            return res.status(400).send({status: "Error",
                payload: "No puedes colocar la misma contraseña. Introduce una nueva"
            })

        }

        const newPasswordHash = createHash(newPassword)

        const result = userController.updatePassword(userId, newPasswordHash)     
        
        if(!result){

            return res.status(500).send({ status: "Error",
                payload: "Hubo un error al cambiar tu contraseña, intentalo de nuevo"
            })

        }

        res.cookie("restoreToken", " ", {
            httpOnly: true,
            expires: new Date(0)
        }).redirect("/login")

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

// router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), (req, res) => {

//     res.send({
//         status: 'success',
//         message: 'Success'
//     })

// })

// router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login?redirect=true"}), (req, res) => {

//     req.user = req.user
//     res.redirect("/profile")

// })


export default router