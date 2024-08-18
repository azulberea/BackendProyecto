const socket = io("http://localhost:8080", {
    transports: ['websocket'], 
    withCredentials: true 
})

const usersContainer = document.getElementById("users-container")

usersContainer.addEventListener("click", async (e)=>{

    if(e.target.tagName === "BUTTON"){

        let userId = e.target.dataset.userid

        console.log(userId)

        const data = {
            userId
        }

        Swal.fire({
            title: `Estas seguro de que deseas eliminar a este usuario? (${userId})`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Si",
            denyButtonText: "No"
        }).then( async (result) => {
            if (result.isConfirmed) {

                await fetch(`/api/users/${userId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:  JSON.stringify(data)
                })
        
                Swal.fire("Usuario eliminado con éxito!", "", "success")

                setTimeout( ()=>{
                    location.reload()
                },4000)

            } 
            // else if (result.isDenied) {
            //   Swal.fire("Changes are not saved", "", "info");
            // }
        })

    }
})
