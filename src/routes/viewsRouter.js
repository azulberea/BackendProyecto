import { PMDB } from "../dao/Dao/productManagerDB.js";
import { Router } from "express";
import { productModel } from "../dao/models/productModel.js";
import { CMDB } from "../dao/Dao/cartManagerDB.js";
import { cartModel } from "../dao/models/cartModel.js";

const router = Router()

router.get("/", async (req, res) => {

    let { limit } = req.query

    try{

        let products = await PMDB.getProducts()
        
        if(!limit){

            res.status(200).render("home", {

                products: products,
                style: "styles.css"

            })

            return

        }

        let productsLimited = products.slice(0, limit)

        res.status(200).render("home", {

            products: productsLimited,
            style: "styles.css"       

        })

    }catch(error){

        console.error(error.message)

    }
    
})

router.get("/realTimeProducts", async (req, res) => {

    let { limit } = req.query

    try{

        let products = await PMDB.getProducts()

        if(!limit){

            res.status(200).render("realTimeProducts", {

                products: products,
                style: "styles.css"

            })

            return

        }

        let productsLimited = products.slice(0, limit)

        res.status(200).render("realTimeProducts", {

            products: productsLimited,
            style: "styles.css"       

        })

    }catch(error){

        console.error(error.message)

    }

})

router.get("/products", async (req, res)=>{

    const { page } = req.query

    try{

        const options = {
            page:page ? page : 1,
            limit:10,
            lean:true
        }

        const result = await productModel.paginate({}, options)

        if(!result){

            return res.status(400).render("errorPage",{})

        }

        return res.status(200).render("productsWithPaginate", {

            style: "styles.css",
            products: result.docs,
            previousPage: result.hasPrevPage ? result.prevPage : result.page,
            nextPage: result.hasNextPage ? result.nextPage : result.page

        })

    }catch(error){

        console.error(error.message)

    }

})

router.get("/carts/:cartid", async (req, res)=>{

    const cartId = req.params.cartid

    try{

        const result = await cartModel.findOne({_id:cartId}).populate("products.product").lean()
        console.log(result.products)

        if(!result){

            return res.status(400).render("errorPage",{})

        }

        return res.status(200).render("cart", {

            style: "styles.css",
            products: result.products

        }) 

    }catch{}

})

export default router