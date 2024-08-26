const port = window.location.port

setTimeout( ()=>{
    window.location.replace(`http://localhost:${port}/products`)
},6000)