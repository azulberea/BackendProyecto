import mongoose from "mongoose"
import { cartModel } from "../models/cartModel.js"
import { PMDB } from "./productManagerDB.js"

export class cartManagerDB {

    async createCart() {

        try{

            const result = await cartModel.create({

                products: []

            })

            return result

        }catch(error){

            console.error(error.message)

        }

    }
    
    async getCarts() {

        try{

            const result = await cartModel.find()

            if(!result){

                console.log("hubo un error")

                return
            }

            console.log(result)
            return result

        }catch(error){

            console.error(error.message)

        }

    }

    async getCartById(cartId) {

        try{
        
            const result = await cartModel.findOne({_id:cartId})

            if(!result){

                return

            }

            console.log(result)
            return result
        
        }catch(error){

            console.error(error.message)

        }

    }

    async getCartProduct(productId, cartId){

        try{

            const cartRequired = await cartModel.findOne({_id:cartId})

            if(!cartRequired){

                return

            }

            const productRequired = cartRequired.products.find(product => product.product == productId)

            return productRequired

        }catch(error){

            console.error(error.message)

        }

    }
    
    async getAllCartProducts(cartId) { //FUNCIONA

        try{

            const cart = await cartModel.findOne({_id:cartId}).populate("products.product")

            if(!cart){

                return

            }

            const result = cart.products
            console.log(result)
            return result

        }catch(error){

            console.error(error.message)

        }

    }

    async addProductToCart(productId, cartId) { //FUNCIONA

        try{

            const cartRequired = await cartModel.findOne({_id:cartId})

            const productRequired = await PMDB.getProductById(productId)

            if(!cartRequired || !productRequired){

                return

            }

            const productInCart = cartRequired.products.find(prod => prod.product == productId)

            let result

            if(productInCart){
                        
                result = cartModel.updateOne({_id: cartId, 'products.product': productId},{$inc: { 'products.$.quantity': 1 }})

                console.log(result)
                return result

            }

            result = await cartModel.updateOne({_id:cartId}, {$push: {products:{product: productRequired._id, quantity: 1}}})

            console.log(result)
            return result

        }catch(error){

            console.error(error.message)

        }

    }

    async deleteProductFromCart(productId, cartId) { //FUNCIONA!!!!!!!!

        try{

            const validateProduct = await cartModel.findOne({_id:cartId, "products.product": productId})

            if(!validateProduct){

                return

            }

            const result = await cartModel.updateOne({_id:cartId, "products.product": productId},{$pull: { products: {product: productId }}})

            if(!result){
                
                return
            }
            
            return result

        }catch(error){

            console.error(error.message)

        }
    }

    async deleteAllProductsFromCart(cartId){ //FUNCIONS, despues puedo modificarla para que primero verifique que haya productos en el carrito antes de eliminar

        try{

            const validateCart = await cartModel.findOne({_id:cartId})

            if(!validateCart){

                return 
            
            }

            const result = await cartModel.updateOne({_id:cartId},{products:[]})

            return result

        }catch(error){

            console.error(error.message)
        }
    }

    async deleteCart(cartId){

        try{

            const validateCart = await cartModel.findOne({_id: cartId})

            if(!validateCart){

                return

            }

            const result = await cartModel.deleteOne({_id: cartId})

            if(!result){

                return

            }

            console.log(result)
            return result

        }catch(error){

            console.error(error.message)

        }
    }

    async updateProductQuantity(cartId, productId, quantity){

        try{

            const validateCart = await cartModel.findOne({_id: cartId})

            if(!validateCart){

                console.log("carrito inexistwente")
                return

            }

            const productInCart = validateCart.products.find(prod => prod.product == productId)

            if(!productInCart){

                return 

            }

            const result = await cartModel.updateOne({_id:cartId, "products.product": productId},{$set: {"products.$.quantity":quantity} })

            if(!result){

                return

            }

            return result

        }catch(error){

            console.error(error.message)

        }

    }

    async updateCartProducts(cartId, products){

        try{

            const validateCart = await cartModel.findOne({_id:cartId})

            if(!validateCart){

                return

            }

            const result = cartModel.updateOne({_id:cartId},{products:products})

            return result

        }catch(error){

            console.error(error.message)

        }

    }
}

export const CMDB = new cartManagerDB 


