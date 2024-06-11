import ticketModel from "../../models/ticketModel.js";

export default class TicketService {

    async add(ticket){

        try{

            const result = await ticketModel.create(ticket)

            return result

        }catch(error){

            console.log(error.message)

            return null

        }

    }
}