const socket = io("http://localhost:8080", {
    transports: ['websocket'], 
    withCredentials: true 
})

const changeMembershipButton = document.getElementById("change-membership")

const profileInfo = document.getElementById("profile-info")

profileInfo.addEventListener("click", (e)=> {
    
    if(e.target.tagName === "BUTTON"){

        socket.emit("changeMembership")

    }

})

socket.on("membershipChangedSuccesfully", data => {

    return Toastify({
        text: `Tu membresia se ha actualizado correctamente. Por favor, vuelve a iniciar sesion para ver los cambios reflejados`,
        gravity: "bottom",
        position: "right",
        duration: 3000
    }).showToast()

})

// fetch("/api/users/info")
// .then(response => response.json())
//     .then(data => {

//         const userId = data._id
//         const membership = data.premium ? "premium" : "normal"

//         console.log(userId)
//         console.log(membership)

//         changeMembershipButton.addEventListener("click", (event)=> {
//             fetch(`/api/users/premium/${userId}`, { 
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     user: userId,
//                     membership
//                 })
//             })
//             .then(response => {
//                 if(response.status === 302){
//                     return response.json()
//                 }else{
//                     return Toastify({
//                         text: `Hubo un error al redireccionarte al perfil: ${error.message}`,
//                         gravity: "bottom",
//                         position: "right",
//                         duration: 3000
//                     }).showToast()
//                 }
//             }) 
//                 .then(data => {
//                     window.location.href = data.redirectionURL
//                 })
//                 .catch(error => {
//                     Toastify({
//                         text: `Hubo un error al redireccionarte al perfil: ${error.message}`,
//                         gravity: "bottom",
//                         position: "right",
//                         duration: 3000
//                     }).showToast()
//                 })
//             })

//     })
//     .catch(error => {
//         Toastify({
//             text: `Hubo un error al obtener la informacion del usuario. ${error.message}`,
//             gravity: "bottom",
//             position: "right",
//             duration: 3000
//         }).showToast()
//     })

