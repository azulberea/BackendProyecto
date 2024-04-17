import fs from "fs"
import { PMFS } from "./productManagerFS.js"

export class cartManager {

    constructor() { 

        this.carts = []

        this.path = "./data/cartManager.json"  

        !fs.existsSync(this.path) ?  

            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t")) :

            this.carts = JSON.parse(fs.readFileSync(this.path, "utf8"))

    }

    createCart(products) {

        const uniqueID = Date.now()

        const cart = {
            id: uniqueID,
            products: products ? products : []
        }

        this.carts.push(cart)

        fs.existsSync(this.path) &&

            fs.writeFileSync(this.path, JSON.stringify(this.carts,null,"\t"))

    }
    
    getCarts() {

        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))

        return file

    }

    getCartById(cartId) {

        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))

        for(let cart of file) {  

            if(cart.id == cartId) {

                return cart  

            }    

        }   

        return "Not found"

    }

    getCartProducts(cartId) {

        const cart = this.getCartById(cartId)

        if(cart == "Not found") {

            return "Not found"
            
        }

        return cart.products

    }

    validateByProductId(productId, cartId) {

        const cartRequired = this.carts.find(cart => cart.id == cartId)

        const productRequired = PMFS.productos.find(product => product.id == productId)

        return cartRequired.products.some(product => product.id == productRequired.id)

    }

    addProductToCart(productId, cartId) {

        const cartRequired = this.carts.find(cart => cart.id == cartId)

        const productRequired = PMFS.productos.find(product => product.id == productId)

        if(!cartRequired || !productRequired){

            return "Not found"

        }

        const productAdapted = {
            id:productRequired.id,
            quantity:1
        }

        if(!this.validateByProductId(productId, cartId)){

            cartRequired.products.push(productAdapted)

            fs.existsSync(this.path) &&

                fs.writeFileSync(this.path, JSON.stringify(this.carts,null,"\t"))

            return

        }

        cartRequired.products.find(product=>product.id == productAdapted.id).quantity += 1

        fs.existsSync(this.path) &&

            fs.writeFileSync(this.path, JSON.stringify(this.carts,null,"\t"))

    }

}

