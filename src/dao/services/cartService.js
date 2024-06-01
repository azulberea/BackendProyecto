import { cartModel } from "../models/cartModel.js";
import { productController } from "../Dao/productController.js";

export default class CartService {

    async add(){ //puedo agregar q se le pasen los productos por paramentro
        //OK

        try {
            
            const result = await cartModel.create({products:[]})

            if(!result){

                console.log("-CART SERVICE hubo un error creando el carrito")

                return

            }

            console.log(`-CARTSERVICE carrito creado correctamente`)

            return result
        
        }catch(error){

            console.log(`-CARTSERVICE CATCH error creando carrito: ${error.message}`)

            return 
            
        }

    }

    async getAll(){

        try{

            const result = await cartModel.find()

            console.log(`-CARTSERVICE carritos obtenidos exitosamente: ${result}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH error obteniendo los carritos: ${error.message}`)

            return 

        }

    }

    async getById(id){

        try{

            const result = await cartModel.findOne({_id:id})

            console.log(`-CARTSERVICE carrito obtenido por ID exitosamente: ${result}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH error obteniendo carrito por su ID: ${error.message}`)

            return

        }

    }

    async getProductFromCart(productId, cartId){ //FUNCIONA

        try{

            const cartRequired = await this.getById(cartId)

            const result = await cartRequired.products.find(product => product.product == productId)

            console.log(`-CARTSERVICE producto obtenido: ${result}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH error obteniendo producto del carrito: ${error.message}`)

            return 

        }

    }

    async getAllProducts(cartId) { 

        try{

            const result = await cartModel.findOne({_id:cartId}).populate("products.product")

            console.log(`-CARTSERVICE productos obtenidos del carrito correctamente ${result.products}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH hubo un error al obtener todos los productos del carrito: ${error.message}`)

            return

        }

    }

    async addProduct(productId, cartId) { //NOSE SI LA HICE BIEN. IDEA: HACER METODO PARA INCREMENTAR CANTIDAD EN UNO

        try{

            const result = await cartModel.updateOne({_id:cartId}, {$push: {products:{product: productId, quantity: 1}}})

            console.log(`-CARTSERVICE producto agregado al carrito correctamente`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH hubo un error al agregar el producto al carrito: ${error.message}`)

            return

        }

    }

    async deleteProduct(productId, cartId) {

        try{

            const result = await cartModel.updateOne({_id:cartId, "products.product": productId},{$pull: { products: {product: productId }}})

            console.log(`-CARTSERVICE producto eliminado del carrito exitosamente ${result}`)
            
            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH no se ha podido eliminar el producto del carrito: ${error.message}`)

            return

        }
    }

    async deleteAllProducts(cartId){ 

        try{

            const result = await cartModel.updateOne({_id:cartId},{products:[]})

            console.log(`-CARTSERVICE productos eliminados del carrito correctamente ${result}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH no se han podido eliminar los productos del carrito: ${error.message}`)

            return

        }

    }

    async deleteCart(id){

        try{

            const result = await cartModel.deleteOne({_id: id})

            console.log(`-CARTSERVICE carrito eliminado correctamente ${result}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH hubo un error al eliminar el carrito: ${error.message}`)

            return

        }

    }

    async updateProductQuantity(cartId, productId, quantity){

        try{

            const result = await cartModel.updateOne({_id:cartId, "products.product": productId},{$set: {"products.$.quantity":quantity} })

            console.log(`-CARTSERVICE cantidad actualizada correctamente`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH no se pudo actualizar la cantidad del producto: ${error.message}`)

            return

        }

    }

    async updateProducts(cartId, products){

        try{

            const result = cartModel.updateOne({_id:cartId},{products:products})

            console.log(`-CARTSERVICE todos los productos del carrito se han actualizado correctamente ${result}`)

            return result

        }catch(error){

            console.log(`-CARTSERVICE CATCH no se han podido actualizar todos los productos del carrito: ${error.message}`)

            return

        }

    }

}
