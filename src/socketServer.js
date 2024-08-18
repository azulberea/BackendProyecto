import { productController } from "./controllers/productController.js";
import { cartController } from "./controllers/cartController.js";
import { userController } from "./controllers/userController.js";
import { transport } from "./utils/nodemailerUtils.js";
import config from "./config/config.js";

const { senderEmail } = config

export default (io)=> io.on("connection", socket => {

    console.log(`nuevo cliente conectado`)
    
    socket.on("addProduct", async (data) => {

        try{

            const updatedUserInfo = await userController.getUserById(socket.user._id)

            if(!updatedUserInfo.premium){

                return socket.emit("errorOnCreation", "No tienes permiso para hacer esto. Vuelve a iniciar sesion")
            }

            const owner = socket.user.email

            const isAdmin = socket.user.role == "admin"

            data.push(owner) 

            const result = await productController.addProduct(...data)

            if(!result){
                        
                socket.emit("errorOnCreation", "Hubo un error al crear el producto. Asegurate de haber llenado todos los campos con datos válidos y que el producto no exista en la base de datos")

                return

            }

            const products = await productController.getProducts()

            const productsWithPermissions = products.map( product=>{
    
                return {...product,
                    canModify: product.owner == owner || isAdmin
                }
    
            })

            socket.emit("getProducts", productsWithPermissions)

        }catch(error){

            console.error(error.message)

        }

        
    })

    socket.on("deleteProduct", async (data) => {

        try{

            const productToDelete = await productController.getProductById(data)

            await productController.deleteProduct(data)

            if(socket.user.role == "admin") {

                await transport.sendMail({
                    from: `Beyond Supplements <${senderEmail}>`,
                    to: productToDelete.owner,
                    subject: "Producto eliminado",
                    html: ` <div>
                                <h1>Uno de tus productos ha sido eliminado</h1>
                                <p>Se ha eliminado tu producto "${productToDelete.title}" de nuestro catálogo. Para mas informacion contactanos. </p>
                            </div>`
                })

            }

            const products = await productController.getProducts()

            socket.emit("getProducts", products)

        }catch(error){

            console.error(error.message)

        }

    })

    socket.on("addToCart", async (data) => {

        const user = socket.user

        const cartId = user.cart 

        try{

            const product = await productController.getProductById(data)

            if(user.email == product.owner){

                return socket.emit("productOwned",product)

            }

            if(await cartController.getCartProduct(data, cartId)){

                console.log("pasa x aca")

                const result = await cartController.incOrDecProductQuantity(cartId, data, "inc")

                return socket.emit("addedSuccessfully", data)
            }

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

        const cartId = socket.user.cart

        try{

            await cartController.deleteProductFromCart(data, cartId)

            let cart = await cartController.getAllCartProducts(cartId)

            socket.emit("getProductsFromCart", cart.products)

        }catch(error){

            console.error(error.message)

        }

    })

    socket.on("changeMembership", async (data)=> {

        const userId = socket.user._id

        try{

            const result = await userController.updateMembership(userId)

            if(result.modifiedCount == 0){

                return socket.emit("errorChangingMembership", socket.user)

            }
            
            const newUserData = await userController.getUserById(userId)

            socket.user = newUserData
            
            socket.emit("membershipChangedSuccesfully", socket.user)

        }catch(error){

            console.error(error.message)

        }

    })

})

