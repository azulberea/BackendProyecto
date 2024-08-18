import { Router } from "express";

import moment from "moment";
import {fileURLToPath} from "url"
import { cartController } from "../controllers/cartController.js";
import TicketService from "../dao/classes/mongo/ticketDAOMongo.js";
import { ticketController } from "../controllers/ticketController.js";

const router = Router()

router.get("/loggerTest", async (req, res) => {

    try{

        req.logger.fatal(`level FATAL at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        (prod in file and console and dev in console)`)

        req.logger.error(`level ERROR at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        (prod in file and console and dev in console)`)

        req.logger.warning(`level WARNING at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        (prod and dev in console)`)

        req.logger.info(`level INFO at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        (prod and dev in console)`)

        req.logger.http(`level HTTP at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        (dev in console)`)

        req.logger.debug(`level: debug at ${req.url} on ${moment().format('MMMM Do YYYY, h:mm:ss a')} 
        (dev in console)`)

        return res.status(200).send({status: "success",
            message: "logger test endpoint"})

    }catch(error){

        req.logger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        message: ${error.message}`)

        return res.status(500).send({status: "Error",
            payload: error.message
        })

    }

})

router.put("/incrementTest", async (req, res)=> { //funciona incrementar y decrementar

    const { cartId, productId } = req.body

    try{

        const result = await cartController.incOrDecProductQuantity(cartId, productId, "dec")

        res.send({result})
        
    }catch(e){

    }

})

router.get("/populateticket", async (req, res)=> {

    try{

        const { ticketid } = req.body

        const result = await ticketController.getTicket(ticketid)

        return res.send({result})

    }catch(e){
        res.send({e})
    }
})
export default router