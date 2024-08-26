const port = window.location.port

const url = window.location.origin == `http://localhost:${port}` ? `http://localhost:${port}` : "https://beyond-supplements.onrender.com/"

const socket = io(url, {
    transports: ['websocket'], 
    withCredentials: true 
})
const productsDiv = document.getElementById("products")

productsDiv.addEventListener("click", (e)=>{

    if(e.target.tagName === "BUTTON"){

        let productId = e.target.dataset.productid

        socket.emit("addToCart", productId)

    }
})

socket.on("productOwned", data=>{
    Toastify({
        text: `Eres el propietario de este producto (${data._id}), no se puede añadir al carrito.`,
        gravity: "bottom",
        position: "right",
        duration: 3000
    }).showToast()
})

socket.on("unavailableProduct", data=>{
    Toastify({
        text: `Stock insuficiente 🥺 (id: ${data})`,
        gravity: "bottom",
        position: "right",
        duration: 3000
    }).showToast()
})

socket.on("addedSuccessfully", data =>{

    Toastify({
        text: `El producto fue añadido al carrito exitosamente (id: ${data})`,
        gravity: "bottom",
        position: "right",
        duration: 3000
    }).showToast()

})