import moment from "moment";
import {fileURLToPath} from "url";

import { defineLogger } from "../utils/logger.js";
import { cartModel } from "../dao/models/cartModel.js";
import CartService from "../dao/classes/mongo/cartDAOMongo.js";
import { productController } from "./productController.js";
import { userController } from "./userController.js";

export class CartController{

    constructor() {

        this.cartService = new CartService()

    }

    async createCart() { //OK

        try{

            const result = await this.cartService.add()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }
    
    async getAllCarts() { //FUNCIONA

        try{

            const result = await this.cartService.getAll()

            if(!result){

                defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: hubo un error obteniendo todos los carritos (no result)`)

                return

            }

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async getCartById(id) {

        try{
        
            const result = await this.cartService.getById(id)

            if(!result){

                defineLogger.info(`No existe un carrito con ese ID (${id})`)

                return

            }

            return result
        
        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async getCartProduct(productId, cartId){

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                defineLogger.info(`No existe un carrito con ese ID  XD(${cartId})`)

                return

            }

            const result = await cartRequired.products.find(product => product.product == productId)

            if(!result){

                // defineLogger.info(`No existe un producto con ese ID (${productId}) en el carrito (${cartId})`)

                return

            }

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async getAllCartProducts(cartId, lean) { //FUNCIONA

        try{

            const result = await this.cartService.getAllProducts(cartId, lean)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async addProductToCart(productId, cartId) { 

        try{

            const cartRequired = await this.cartService.getById(cartId)

            const productRequired = await productController.getProductById(productId)

            if(!cartRequired || !productRequired){

                defineLogger.info(`Producto ${productId} o carrito ${cartId} inexistente`)

                return

            }


            if(productRequired.stock == 0){

                defineLogger.info(`Producto ${productId} sin stock`)

                return null

            }

            const productOwner = await userController.getUserByEmail(productRequired.owner)

            if(cartId == productOwner.cart){
                
                defineLogger.info(`No se puede agregar al carrito un producto propio`)

                return null

            }

            const result = await this.cartService.addProduct(productId, cartId)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async deleteProductFromCart(productId, cartId) {  //FUNCIONA

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                defineLogger.info(`No existe un carrito con ese ID (${cartId})`)

                return

            }

            const productRequired = await this.cartService.getProductFromCart(productId, cartId)

            if(!productRequired){

                defineLogger.info(`Producto inexistente en el carrito`)

                return

            }

            const result = await this.cartService.deleteProduct(productId, cartId)

            if(result.modifiedCount == 0){

                defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: No se pudo eliminar el producto del carrito`)
                
                return

            }
            
            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }

    async deleteAllProductsFromCart(cartId){ //FUNCIONA
 
        try{

            const validateCart = await this.cartService.getById(cartId)

            if(!validateCart){

                defineLogger.info(`No existe un carrito con ese ID (${cartId})`)

                return 
            
            }

            const result = await this.cartService.deleteAllProducts(cartId)


            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }

    async deleteCart(cartId){

        try{

            const validateCart = await this.cartService.getById(cartId)

            if(!validateCart){

                defineLogger.info(`No existe un carrito con ese ID (${cartId})`)

                return

            }

            const result = await this.cartService.deleteCart(cartId)

            if(result.deletedCount == 0){

                defineLogger.info(`Hubo un error eliminando el carrito`)

                return

            }

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }
    }

    async updateProductQuantity(cartId, productId, quantity){ //FUNCIONA

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                defineLogger.info(`No existe un carrito con ese ID (${cartId})`)

                return

            }

            const productInCart = cartRequired.products.find(prod => prod.product == productId)

            if(!productInCart){

                defineLogger.info(`No existe un producto con el ID ${productId} en el carrito ${cartId}`)

                return 

            }

            const result = await this.cartService.updateProductQuantity(cartId, productId, quantity)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async updateCartProducts(cartId, products){ //NO FUNCIONA (LEER ROUTER)

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                //console.log(`-CARTCONTROLLER no se pudieron actualizar los productos ya que no existe un carrito con ese ID`)

                return

            }

            const result = this.cartService.updateProducts(cartId, products)

            //console.log(`-CARTCONTROLLER productos del carrito actualizados correctamente`)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async getFinalAmount(cartId) {

        try{

            const cart = cartModel.findById(cartId)

            const products = cart.products

            const result = products.reduce((accu, product) => {
                return accu + product.price
            }, 0)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null

        }

    }

    async incOrDecProductQuantity(cartId, productId, operation) {

        try{

            if(operation != "inc" && operation != "dec") {

                throw new Error(`Elije un operacion valida ("inc": incrementar. "dec": decrementar)`)
                // defineLogger.warning(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                // message: Elije un operacion valida ("inc": incrementar. "dec": decrementar)`)

                // return null

            }

            if(operation == "inc") {

                const product = await productController.getProductById(productId)

                const productStock = product.stock

                const productInCart = await this.cartService.getProductFromCart(productId, cartId)

                if( productStock == productInCart.quantity){

                    throw new Error("No se puede incrementar la cantidad del producto porque no hay suficiente stock")

                }

                const result = await this.cartService.incrementProductQuantity(cartId, productId)

                return await this.cartService.getById(cartId)

            }

            if(operation == "dec") {

                const productInCart = await this.cartService.getProductFromCart(productId, cartId)

                if(productInCart.quantity == 1){

                    const result = await this.cartService.deleteProduct(productId, cartId)

                    return await this.cartService.getById(cartId)

                }

                const result = await this.cartService.decrementProductQuantity(cartId, productId)

                return await this.cartService.getById(cartId)
            }

        }catch(error) {

            console.log(error.message)
            
            return null
        
        }
    }

}

export const cartController = new CartController()


