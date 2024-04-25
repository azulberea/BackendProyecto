import { Router } from "express";
import userModel from "../dao/models/userModel.js"

const router = Router()

router.post("/register", async (req, res)=> {
    try{

        req.session.failedRegister = false

        const user = req.body

        await userModel.create(req.body)

        res.redirect("/login")
        
        delete user.password

        req.session.user = user
        
        console.log(user)
        
    }catch(error){

        req.session.failedRegister = true

        return res.redirect("/register")

    }
})

router.post("/login", async (req, res)=> {

    try{

        req.session.failedLogin = false
        
        const { email, password } = req.body

        const result = await userModel.findOne({email:email})

        if(!result){
            req.session.failedLogin = true
            return res.redirect("/login")
        }

        if(password !== result.password){
            req.session.failedLogin = true
            return res.redirect("/login")
        }

        delete result.password

        if(email == "adminCoder@coder.com"){
            result.role = "admin"
        }else{
            result.role = "user"
        }

        console.log(result)

        req.session.user = result
        return res.redirect("/products")

    }catch(error){

        console.log(error)
        
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