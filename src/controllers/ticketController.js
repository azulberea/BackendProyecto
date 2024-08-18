import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../utils/logger.js";
import TicketService from "../dao/classes/mongo/ticketDAOMongo.js";
import { cartController } from "./cartController.js";
import { productController } from "./productController.js";
import { transport } from "../utils/nodemailerUtils.js";
import config from "../config/config.js";

const {senderEmail} = config

export class TicketController {

    constructor() {

        this.ticketService = new TicketService()

    }

    async addTicket(cartId, purchaser) {

        try{

            const cart = await cartController.getAllCartProducts(cartId, false)

            if(cart.products.length == 0){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No se genero un ticket porque el carrito esta vacío`)

                return

            }

            if(!cart){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No se encontró ningun carrito`)

                return

            }

            const totalAmount = cart.products.reduce((accu, product) => {
                return accu + product.product.price
            }, 0)

            const cartLean = await cartController.getAllCartProducts(cartId, true)

            const products = cartLean.products.map( product => { //lo hice asi porque no sabia como poblar el array products del cart en el ticket
                return {
                    ...product,
                    product: product.product.title,
                    price: product.product.price
                }
            })

            const ticket = {
                code: Date.now() + Math.floor(Math.random() * 10000 + 1),
                purchase_datetime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                cart,
                products,
                amount: parseInt(totalAmount),
                purchaser 
            }

            for(const product of cart.products){

                await productController.refreshStock(product.product._id, product.quantity)

            }

            await cartController.deleteAllProductsFromCart(cartId)

            const result = await this.ticketService.add(ticket) 

            if(!result){

                defineLogger.warning(`level WARNING at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No se pudo realizar la compra`)

                return
                
            }

            await transport.sendMail({
                from: `Beyond Supplements <${senderEmail}>`,
                to: purchaser,
                subject: "Se ha generado tu orden de compra",
                html: ` <div>
                            <h1>Gracias por elegirnos!</h1>
                            <p>Tu numero de orden es ${result.code}. Con ese codigo podes realizar el seguimiento de tu pedido o retirarlo en nuestra tienda</p>
                        </div>`
            })

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getTicket(ticketId) {

        try{

            const result = await this.ticketService.get(ticketId)

            if(!result){
                
                defineLogger.info(`level INFO at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No existe un ticket con ese id (${ticketId})`)

                return

            }

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

}

export const ticketController = new TicketController()