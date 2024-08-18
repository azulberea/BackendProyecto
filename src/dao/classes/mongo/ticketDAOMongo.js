import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../../../utils/logger.js";
import ticketModel from "../../models/ticketModel.js";

export default class TicketService {

    async add(ticket){

        try{

            const result = await ticketModel.create(ticket)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async get(ticketId){

        try{

            const result = await ticketModel.findOne({_id:ticketId}).lean()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }
}