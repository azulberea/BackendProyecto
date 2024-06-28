import { Router } from "express";
import moment from "moment";

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

        return res.status(500).send({
            status: "error",
            message: error.message
        })

    }

})

export default router