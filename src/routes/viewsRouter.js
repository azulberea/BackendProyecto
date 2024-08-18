import { productController } from "../controllers/productController.js";
import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import { premiumAuth, roleAuth } from "../middlewares/auth.js";
import { passportCall } from "../utils/passportUtils.js";
import config from "../config/config.js";

import {fileURLToPath} from "url"
import moment from "moment";
import jwt from "jsonwebtoken"
import { userController } from "../controllers/userController.js";

const router = Router()

const { jwtSecretKey } = config

router.get("/realTimeProducts", passportCall("jwt"), roleAuth("all"), premiumAuth(), async (req, res) => {

    let { limit } = req.query


    try{

        const user = req.user

        const isAdmin = user.role == "admin"

        const userEmail = user.email

        let result = await productController.getProducts()

        const productsWithPermissions = result.map( product=>{
            
            return {...product,
                canModify: product.owner == userEmail || isAdmin
            }

        })

        if(!limit){

            return res.status(200).render("realTimeProducts", {

                cartURL: `http://localhost:8080/carts/${user.cart}`,
                products: productsWithPermissions,
                style: "styles.css"

            })

        }

        let productsLimited = productsWithPermissions.slice(0, limit)

        res.status(200).render("realTimeProducts", {

            products: productsLimited,
            cartURL: `http://localhost:8080/carts/${user.cart}`,
            style: "styles.css"       

        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/products", passportCall("jwt"), roleAuth("all"), async (req, res)=>{

    const { page } = req.query

    const user = req.user

    try{

        const options = {
            page:page ? page : 1,
            limit:10,
            lean:true
        }

        const result = await productController.getProductsPaginated({}, options)

        return res.status(200).render("products", {

            style: "styles.css",
            cartURL: `http://localhost:8080/carts/${user.cart}`,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            products: result.docs,
            previousPage: result.hasPrevPage ? result.prevPage : result.page,
            nextPage: result.hasNextPage ? result.nextPage : result.page,
            isAdmin: user.role == "admin" ? true : false

        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/carts/:cartid", passportCall("jwt"), roleAuth("user"), async (req, res)=>{

    try{

        if(req.params.cartid != req.user.cart){

            return res.redirect(`/carts/${req.user.cart}`)

        }
        
        const cartId = req.user.cart

        const result = await cartController.getAllCartProducts(cartId, true)

        return res.status(200).render("cart", {

            style: "styles.css",
            products: result.products,
            cart: req.user.cart,
            email: req.user.email

        }) 

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/login", async (req, res)=>{

    const { redirected } = req.query

    try{

        if(req.cookies.authToken){

            return res.redirect("/profile")

        }

        return res.render("login",{
            style: "styles.css",
            redirected
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/register", async (req, res)=>{

    const { redirected } = req.query

    try{

    if(req.cookies.authToken){ 

        return res.redirect("/profile")
        
    }

    return res.render("register",{
        style: "styles.css",
        redirected
    })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/", async (req, res) => {

    try{

        res.render("home", {
            style: "styles.css"
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/profile", passportCall("jwt"), roleAuth("all"), async (req, res)=>{

    try{
        const updatedUserInfo = await userController.getUserById(req.user._id)

        req.user = updatedUserInfo  
        
        res.render("profile",{
            style: "styles.css",
            cartURL: `http://localhost:8080/carts/${req.user.cart}`,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            membership: req.user.premium ? "premium" : "normal",
            id: req.user._id
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/passwordRestore", async (req, res)=>{

    try{

        if(req.cookies.authToken){ 

            return res.redirect("/profile")
            
        }

        return res.render("passwordRestore",{
            style: "styles.css"
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/confirmPasswordRestore/:restoreId", async (req, res) => {

    try{
        
        if(req.cookies.authToken){ 

            return res.redirect("/profile")
            
        }

        const restoreToken = req.cookies.restoreToken

        if(!restoreToken){

            return res.status(400).send({status:"Error",
                payload: "El token no existe o expiró. Vuelve a solicitar una restauracion de contraseña"
            })

        }

        const decoded = jwt.verify(restoreToken, jwtSecretKey)

        if(req.params.restoreId != decoded.restoreId){

            return res.status(400).send({status: "Error",
                payload: "Enlace invalido"
            })

        }

        return res.render("confirmPasswordRestore",{
            style: "styles.css"
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/successfulPurchase", passportCall("jwt"), async (req, res) => {

    try{

        const purchaseToken = req.cookies.purchaseToken

        if(!purchaseToken){ 

            return res.redirect("/products")
            
        }

        const decoded = jwt.verify(purchaseToken, jwtSecretKey)

        res.cookie("purchaseToken", " ", {
            httpOnly: true,
            expires: new Date(0)
        }).render("successfulPurchase",{
            style: "styles.css",
            code: decoded.code
        })

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.get("/adminDashboard/users",passportCall("jwt"), roleAuth("admin"), async (req, res) => {

    try{

        const users = await userController.getAllUsers()

        const usersToShow = users.map( user => {
            return {
                full_name: user.first_name + user.last_name,
                email: user.email,
                age: user.age,
                membership: user.premium ? "premium" : "normal",
                cart: user.cart,
                last_connection: user.last_connection,
                status: user.status ? "activo" : "inactivo",
                id: user._id,
                isAdmin: user.role == "admin" && true
            }
        })

        return res.render("userManagement",{
            style: "styles.css",
            users: usersToShow
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