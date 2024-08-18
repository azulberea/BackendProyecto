import moment from "moment";
import { fileURLToPath } from "url";

import { defineLogger } from "../../../utils/logger.js";
import { cartModel } from "../../models/cartModel.js";
import { productController } from "../../../controllers/productController.js";

export default class CartService {

    async add(){ //puedo agregar q se le pasen los productos por paramentro
        //OK

        try {
            
            const result = await cartModel.create({products:[]})

            if(!result){

                return

            }

            return result
        
        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getAll(){

        try{

            const result = await cartModel.find()

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getById(id){

        try{

            const result = await cartModel.findOne({_id:id})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getProductFromCart(productId, cartId){ //FUNCIONA

        try{

            const cartRequired = await this.getById(cartId)

            const result = await cartRequired.products.find(product => product.product == productId)

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async getAllProducts(cartId, lean) { 

        try{

            const resultNotLean = await cartModel.findOne({_id:cartId}).populate("products.product")

            const resultLean = await cartModel.findOne({_id:cartId}).populate("products.product").lean()

            if(lean == true){

                return resultLean

            }

            return resultNotLean

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    // async incrementProductByOne (cartId, productId) {

    //     try{

    //         const result = await cartModel.updateOne({_id:cartId}, {$set: {products:{product: productId, quantity: quantity+1}}})

    //         return result

    //     }catch(error) {

    //         console.log(error.message)
            
    //         return null
        
    //     }

    // }

    async addProduct(productId, cartId) { //NOSE SI LA HICE BIEN. IDEA: HACER METODO PARA INCREMENTAR CANTIDAD EN UNO

        try{

            const result = await cartModel.updateOne({_id:cartId}, {$push: {products:{product: productId, quantity: 1}}})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }


    async incrementProductQuantity(cartId, productId) {

        try {
            
                const result = await cartModel.findOneAndUpdate(
                    { _id: cartId, "products.product": productId },
                    { $inc: { "products.$.quantity": 1 } }
                    )
        
                return result 

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async decrementProductQuantity(cartId, productId) {

        try{

            const result = await cartModel.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $inc: { "products.$.quantity": -1 } }
            )
        
            return result 

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async deleteProduct(productId, cartId) {

        try{

            const result = await cartModel.updateOne({_id:cartId, "products.product": productId},{$pull: { products: {product: productId }}})
            
            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }
    }

    async deleteAllProducts(cartId){ 

        try{

            const result = await cartModel.updateOne({_id:cartId},{products:[]})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async deleteCart(id){

        try{

            const result = await cartModel.deleteOne({_id: id})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async updateProductQuantity(cartId, productId, quantity){

        try{

            const result = await cartModel.updateOne({_id:cartId, "products.product": productId},{$set: {"products.$.quantity":quantity} })

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

    async updateProducts(cartId, products){

        try{

            const result = cartModel.updateOne({_id:cartId},{products:products})

            return result

        }catch(error){

            defineLogger.error(`level ERROR at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)

            return null
            
        }

    }

}
