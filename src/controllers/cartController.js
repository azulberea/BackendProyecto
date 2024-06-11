import CartService from "../dao/classes/mongo/cartDAOMongo.js"
import { productController } from "./productController.js"

export class CartController{

    constructor() {

        this.cartService = new CartService()

    }

    async createCart() { //OK

        try{

            const result = await this.cartService.add()

            //console.log(`-CARTCONTROLLER carrito creado correctamente`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al crear el carrito: ${error.message}`)

            return

        }

    }
    
    async getAllCarts() { //FUNCIONA

        try{

            const result = await this.cartService.getAll()

            if(!result){

                //console.log(`-CARTCONTROLLER hubo un error obteniendo todos los carritos`)

                return

            }

            //console.log(`-CARTCONTROLLER carritos obtenidos correctamente: ${result }`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al obteneer los carritos: ${error.message}`)

            return

        }

    }

    async getCartById(id) {

        try{
        
            const result = await this.cartService.getById(id)

            if(!result){

                //console.log(`-CARTCONTROLLER no existe un carrito con ese ID`)

                return

            }

            //console.log(`-CARTCONTROLLER carrito obtenido correctamente ${result}`)

            return result
        
        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al obtener el carrito: ${error.message}`)

            return

        }

    }

    async getCartProduct(productId, cartId){

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                //console.log(`-CARTCONTROLLER no existe un carrito con ese id`)

                return

            }

            const result = await cartRequired.products.find(product => product.product == productId)

            if(!result){

                //console.log(`-CARTCONTROLLER no existe un producto con ese ID en el carrito`)

                return

            }

            //console.log(`-CARTCONTROLLER producto obtenido del carrito exitosamente ${result}`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error obteniendo el producto del carrito: ${error.message}`)

            return 

        }

    }

    async getAllCartProducts(cartId) { //FUNCIONA

        try{

            const result = await this.cartService.getAllProducts(cartId)

            //console.log(`-CARTCONTROLLER productos obtenidos del carrito exitosamente ${result}`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al obtener los productos del carrito: ${error.message}`)

        }

    }

    async addProductToCart(productId, cartId) { //FUNCIONA PERO NO FUNCIONA LA PARTE DE INCREMENTAR EN UNO SI YA ESTA EN EL CARRITO. CREAR FUCNION APARTE EN CART SERVICE PARA INCREMENTAR EN 1

        try{

            const cartRequired = await this.cartService.getById(cartId)

            const productRequired = await productController.getProductById(productId)

            if(!cartRequired || !productRequired){

                //console.log(`-CARTCONTROLLER hubo un error al agregar el producto al carrito. asegurate de que exista un producto y un carrito con esos ID`)

                return

            }

            const productInCart = cartRequired.products.find(prod => prod.product == productId)

            if(productInCart){

                let quantity = productInCart.quantity
                        
                const result = this.cartService.updateProductQuantity(cartId, productId, quantity++)
                
                //console.log(`-CARTCONTROLLER se ha incrementado el producto en 1`)

                return result

            }

            const result = await this.cartService.addProduct(productId, cartId)

            //console.log(`-CARTCONTROLLER producto agregado al carrito correctamente`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error agregando el prodcuto al carrito o incrementandolo en 1: ${error.message}`)

            return

        }

    }

    async deleteProductFromCart(productId, cartId) {  //FUNCIONA

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                //console.log(`-CARTCONTROLLER no existe un carrito con ese ID`)

                return

            }

            const productRequired = await this.cartService.getProductFromCart(productId, cartId)

            if(!productRequired){

                //console.log(`-CARTCONTROLLER este producto no esta en el carrito`)

                return

            }

            const result = await this.cartService.deleteProduct(productId, cartId)

            if(result.modifiedCount == 0){

                //console.log(`-CARTCONTROLLER no se elimino el producto del carrito`)
                
                return

            }
            
            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al eliminar el producto del carrito: ${error.message}`)

            return

        }
    }

    async deleteAllProductsFromCart(cartId){ //FUNCIONA
 
        try{

            const validateCart = await this.cartService.getById(cartId)

            if(!validateCart){

                //console.log(`-CARTCONTROLLER asegurate de que exista un carrito con ese ID`)

                return 
            
            }

            const result = await this.cartService.deleteAllProducts(cartId)

            //console.log(`-CARTCONTROLLER todos los productos han sido eliminados del carrito`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al intentar eliminar todo slos productos del carrito: ${error.message}`)

            return 

        }
    }

    async deleteCart(cartId){

        try{

            const validateCart = await this.cartService.getById(cartId)

            if(!validateCart){

                //console.log(`-CARTCONTROLLER no existe un carrito con ese ID`)

                return

            }

            const result = await this.cartService.deleteCart(cartId)

            if(result.deletedCount == 0){

                //console.log(`-CARTCONTROLLER hubo un error eliminando el carrito`)

                return

            }

            //console.log(`-CARTCONTROLLER carrito eliminado correctamente`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al eliminar el carrito: ${error.message}`)

        }
    }

    async updateProductQuantity(cartId, productId, quantity){ //FUNCIONA

        try{

            const cartRequired = await this.cartService.getById(cartId)

            if(!cartRequired){

                //console.log("-CARTCONTROLLER carrito inexistwente")

                return

            }

            const productInCart = cartRequired.products.find(prod => prod.product == productId)

            if(!productInCart){

                //console.log(`-CARTCONTROLLER ese producto no esta en el carrito`)

                return 

            }

            const result = await this.cartService.updateProductQuantity(cartId, productId, quantity)

            // if(result.modifiedCount == 0){

            //     //console.log(`-CARTCONTROLLER hubo un error modificando el producto`)

            //     return

            // }

            //console.log(`-CARTCONTROLLER cantidad modificada correctamente`)

            return result

        }catch(error){

            //console.log(`-CARTCONTROLLER CATCH hubo un error al modificar la cantidad: ${error.message}`)

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

            //console.log(`-CARTCONTROLLER CATCH hubo un error al actualizar los productos del carrito: ${error.message}`)
        }

    }

    // async incrementProductByOne(cartId, productId) {

    //     try{

    //         const result = await this.cartService.incrementProductByOne(cartId, productId)

    //         return result

    //     }catch(error) {

    //         console.log(error.message)
            
    //         return null
        
    //     }
    // }

}

export const cartController = new CartController()


