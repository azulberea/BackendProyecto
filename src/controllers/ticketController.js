import moment from "moment";
import TicketService from "../dao/classes/mongo/ticketDAOMongo.js";
import { cartController } from "./cartController.js";
import { productController } from "./productController.js";

export class TicketController {

    constructor() {

        this.ticketService = new TicketService()

    }

    async addTicket(cartId, purchaser) {

        try{

            const cart = await cartController.getAllCartProducts(cartId)

            if(cart.products.length == 0){

                throw new Error("El carrito esta vacio")

            }

            const totalAmount = cart.products.reduce((accu, product) => {
                return accu + product.product.price
            }, 0)

            const ticket = {
                code: Date.now() + Math.floor(Math.random() * 10000 + 1),
                purchase_datetime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                cart,
                amount: parseInt(totalAmount),
                purchaser 
            }

            for(const product of cart.products){

                await productController.refreshStock(product.product._id, product.quantity)

            }

            await cartController.deleteAllProductsFromCart(cartId)

            const result = await this.ticketService.add(ticket)

            return result

        }catch(error){

            console.log(error.message)

            return null
            
        }

    }

}

export const ticketController = new TicketController()