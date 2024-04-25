function getCookies(e) {

    e.preventDefault()

    fetch("/cookies/getCookies").then( 
         async res => {
            console.log( await res.json())
        }
    )

}

const getCookiesButton = document.getElementById("getCookies")

getCookiesButton.addEventListener("click", getCookies)