import fs from "fs"
import { productManager } from "./productManager.js";
import { PM } from "./routes/productsRouter.js"

export class cartManager{

    constructor()  { 

        this.carts = []
        this.path = "./data/cartManager.json"  
        
        if (!fs.existsSync(this.path)){   
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
        } else {    
        this.carts = JSON.parse(fs.readFileSync(this.path, "utf8"));   
        }    

    }

    createCart(products){

        const uniqueID = Date.now()

        const cart = {
            id: uniqueID,
            products: products ? products : []
        }

        this.carts.push(cart)

        if(fs.existsSync(this.path)){
            fs.writeFileSync(this.path, JSON.stringify(this.carts,null,"\t"))
        }

    }
    
    getCarts(){

        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))
        return file

    }

    getCartById(cartId){
        let file = JSON.parse(fs.readFileSync(this.path, "utf8"));    
        for(let cart of file){    
            if(cart.id == cartId){    
                return cart  
            }    
        }    
        return "Not found"
    }

    getCartProducts(cartId){

        const cart = this.getCartById(cartId)

        if(cart == "Not found"){
            return "Not found"
        }

        return cart.products

    }

    validateByProductId(productId, cartId){

        const cartRequired = this.carts.find(cart => cart.id == cartId)
        const productRequired = PM.productos.find(product => product.id == productId)

        return cartRequired.products.some(product => product.id == productRequired.id)
    }

    addProductToCart(productId, cartId){

        const cartRequired = this.carts.find(cart => cart.id == cartId)

        const productRequired = PM.productos.find(product => product.id == productId)

        const productAdapted = {
            id:productRequired.id,
            quantity:1
        }

        if(this.validateByProductId(productId, cartId)){
            const productToModify = cartRequired.products.find(product => product.id == productId)
            productToModify.quantity =+ 1
            
            if(fs.existsSync(this.path)){
                fs.writeFileSync(this.path, JSON.stringify(this.carts,null,"\t"))
            }
            return
        }

            cartRequired.products.push(productAdapted)

        if(fs.existsSync(this.path)){
            fs.writeFileSync(this.path, JSON.stringify(this.carts,null,"\t"))
        }
    }


}

