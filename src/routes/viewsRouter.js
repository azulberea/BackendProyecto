import { PMDB } from "../dao/Dao/productManagerDB.js";
import { Router } from "express";

const router = Router()

router.get("/", async (req, res) => {

    let products = await PMDB.getProducts()

    if(!req.query){

        res.status(200).render("home", {

            products: products,
            style: "styles.css"

        })

        return

    }

    let { limit } = req.query

    let productsLimited = products.slice(0, limit)

    res.status(200).render("home", {

        products: productsLimited,
        style: "styles.css"       

    })

})

router.get("/realTimeProducts", async (req, res) => {

    let products = await PMDB.getProducts()

    if(!req.query){

        res.status(200).render("realTimeProducts", {

            products: products,
            style: "styles.css"

        })

        return

    }

    let { limit } = req.query

    let productsLimited = products.slice(0, limit)

    res.status(200).render("realTimeProducts", {

        products: productsLimited,
        style: "styles.css"       

    })

})

export default router