import { productController } from "../dao/Dao/productController.js";
import { Router } from "express";
import { productModel } from "../dao/models/productModel.js";
import { cartController } from "../dao/Dao/cartController.js";
import { cartModel } from "../dao/models/cartModel.js";
import { auth, authAdmin, authLogged } from "../middlewares/auth.js";

const router = Router()


router.get("/realTimeProducts", auth, authAdmin, async (req, res) => {

    let { limit } = req.query

    try{

        let result = await productController.getProducts()

        if(!limit){

            return res.status(200).render("realTimeProducts", {

                products: result,
                style: "styles.css"

            })

        }

        let productsLimited = result.slice(0, limit)

        res.status(200).render("realTimeProducts", {

            products: productsLimited,
            style: "styles.css"       

        })

    }catch(error){

        console.error(error.message)

    }

})

router.get("/products", auth, async (req, res)=>{

    const { page } = req.query

    try{

        const options = {
            page:page ? page : 1,
            limit:10,
            lean:true
        }

        const result = await productController.getProductsPaginated({}, options)

        if(!result){

            return res.status(500).render("errorPage",{})

        }

        return res.status(200).render("products", {

            style: "styles.css",
            user: req.session.user,
            products: result.docs,
            previousPage: result.hasPrevPage ? result.prevPage : result.page,
            nextPage: result.hasNextPage ? result.nextPage : result.page

        })

    }catch(error){

        console.error(error.message)

    }

})

router.get("/carts/:cartid", auth, async (req, res)=>{ //NO SE COMO HACER PARA QUE LAS CARDS DEL CARRITO MUESTREN LA INFO DE LOS PRODUCTOS

    const cartId = req.params.cartid

    try{

        const result = await cartController.getCartById("6621781387846930f3efb0c2")

        if(!result){

            return res.status(400).render("errorPage",{})

        }

        return res.status(200).render("cart", {

            style: "styles.css",
            products: result.products

        }) 

    }catch{}

})

router.get("/cookies", auth, (req, res)=>{
    res.status(200).render("cookies",{

        style: "styles.css"

    })
})

router.get("/login", authLogged, (req, res)=>{

    res.render("login",{
        style: "styles.css",
        failedLogin: req.session.failedLogin ?? false
    })
})

router.get("/register", authLogged, (req, res)=>{

    res.render("register",{
        style: "styles.css",
        failedRegister: req.session.failedRegister ?? false
    })
})

router.get("/", (req, res) => {

    res.render("home", {
        style: "styles.css"
    })
})

router.get("/profile", auth, (req, res)=>{

    res.render("profile",{
        style: "styles.css",
        user: req.session.user
    })

})

export default router