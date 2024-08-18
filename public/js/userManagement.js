

const usersContainer = document.getElementById("users-container")

usersContainer.addEventListener("click", async (e)=>{

    if(e.target.id === "button-delete-user"){

        let userId = e.target.dataset.userid

        console.log(userId)

        const data = {
            userId
        }

        await fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(data)
        })
        
        Toastify({
            text: `Usuario eliminado con exito!`,
            gravity: "bottom",
            position: "right",
            duration: 3000
        }).showToast()

        setTimeout( ()=>{
            location.reload()
        },3000)

    }
    
    if(e.target.id === "button-change-membership") {

        let userId = e.target.dataset.userid

        const data = {
            userId
        }

        await fetch(`/api/users/premium/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body:  JSON.stringify(data)
        })
        
        Toastify({
            text: `Membresia del usuario modificada con exito!`,
            gravity: "bottom",
            position: "right",
            duration: 3000
        }).showToast()

        setTimeout( ()=>{
            location.reload()
        },3000)

    }

})


