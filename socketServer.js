import { productController } from "./src/controllers/productController.js";
import { cartController } from "./src/controllers/cartController.js";


export default (io)=> io.on("connection", socket => {

    const session = socket.request.session;

    console.log(session.user);

    console.log("nuevo cliente conectado")
    
    socket.on("addProduct", async (data) => {

        try{

            const result = await productController.addProduct(...data)

            if(!result){
                        
                socket.emit("errorOnCreation", "Hubo un error al crear el producto. Asegurate de haber llenado todos los campos con datos válidos y que el producto no exista en la base de datos")

                return

            }

            const products = await productController.getProducts()

            socket.emit("getProducts", products)

        }catch(error){

            console.error(error.message)

        }

        
    })

    socket.on("deleteProduct", async (data) => {

        try{

            await productController.deleteProduct(data)

            const products = await productController.getProducts()

            socket.emit("getProducts", products)

        }catch(error){

            console.error(error.message)

        }

    })

    socket.on("addToCart", async (data) => {

        const cartId = session.user.cart

        try{

            const result = await cartController.addProductToCart(data, cartId)

            if(!result){

                return socket.emit("unavailableProduct",data)

            }

            socket.emit("addedSuccessfully", data)

        }catch(error){

            console.error(error.message)

        }

    })

    socket.on("deleteProductFromCart", async (data) => {

        const cartId = session.user.cart

        try{

            await cartController.deleteProductFromCart(data, cartId)

            let cart = await cartController.getAllCartProducts(cartId)

            socket.emit("getProductsFromCart", cart.products)

        }catch(error){

            console.error(error.message)

        }

    })

})

