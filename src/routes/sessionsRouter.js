import { Router } from "express";
import userModel from "../dao/models/userModel.js"
import { isValidPassword, createHash } from "../functionUtils.js";
import passport from "passport";
import local from "passport-local"

const router = Router()

const localStrategy = local.Strategy

router.post("/register",
    passport.authenticate("register", {failureRedirect: "/api/sessions/failedRegister"}),    
    async (req, res)=> {
    try{

        req.session.failedRegister = false

        return res.redirect("/login")
        
    }catch(error) {

        req.session.failedRegister = true

        console.log(error)

        return res.redirect("/register")
         //DSP CAMBIARLO YA Q SI FALLA SE REDIRECCIONA DESDE EL MIDDLEWARE
    }
    
})

router.get("/failedRegister", async (req, res) => {

    try {

        return res.status(400).send({
            status: "error",
            message: "Failed register"
        })

    }catch(error) {

        return res.status(400).send({
            status: "error",
            message: error.message
        })

    }

})

router.post("/login",
    passport.authenticate("login", {failureRedirect: "/api/sessions/failedLogin"}),
    async (req, res) => {

    try{

        if(!req.user) {
            return res.status(401).send({
                status: "error",
                message: "login error"
            })
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        }

        return res.redirect("/profile")

    }catch(error) {

        return res.status(400).send({
            status: "error",
            message: error.message
        })
        
    }
})

router.get("/failedLogin", async (req, res) => {

    try {

        return res.status(400).send({
            status: "error",
            message: "failed login"
        })

    }catch(error) {

        return res.send({
            status: "error",
            message: error.message
        })

    }

})

router.post("/logout", (req, res)=>{
    
    req.session.destroy(err =>{

        if(err){

            console.log("logout error")

            return res.redirect("/profile")

        }

        res.redirect("/")

    })

})

export default router