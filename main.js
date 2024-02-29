const fs = require("fs") 

class productManager{
    
    constructor(){
        this.productos = []
        this.path = "./archivosProductManager/productManager.json"
        this.file = fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t")) 
    }

    addProduct(title, description, price, thumbnail, stock){
        const getId = ()=> {
            let id = this.productos.length + 1
            return id
        }
        let productoAAgregar = {        
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            id: getId(), 
            stock: stock,
        }
        function validarPropiedadesVacias(productoAAgregar) {
            for(let key in productoAAgregar){
                if (productoAAgregar[key] === null || productoAAgregar[key] === undefined || productoAAgregar[key] === ''){
                    return true
                }
            }return false
        }
        // function validarProductoExistente(tituloAAgregar){
        //     this.productos.some(producto=>producto.title == tituloAAgregar) 
        // }
        if(validarPropiedadesVacias(productoAAgregar)){
            console.error()("debes llenar todos los campos")
        }
        // else if(validarProductoExistente(productoAAgregar.title)){
        //     console.log("Producto existente")
        // }
        else{
            this.productos.push(productoAAgregar)
            if(fs.existsSync(this.path)){
                fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))
            }
        }
    }

    getProducts(){
        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))
        return file
    }

    getProductById(id){
        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))
        for(let producto of file){
            if(producto.id === id){
                return producto
            }else{
                return "Not found"
            }
        }
    }

    deleteProduct(id){
        let indiceAEliminar = this.productos.findIndex((producto) => producto.id === id);
        if(indiceAEliminar != -1){
            this.productos.splice(indiceAEliminar,1)
            fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))
        }else{
            console.log("No existe ese producto. Pruebe con otro ID")
        }
    }

    updateProduct(id, campo, modificacion){
        let productoAModificar = this.getProductById(id)
        if(productoAModificar != "Not found"){
            if(campo == "id"){
                console.log("No se puede modificar ese campo del producto. Elija otro")
                return
            }
        productoAModificar[campo] = modificacion
        this.deleteProduct(id)
        this.productos.push(productoAModificar)
        fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))
        }else{
            console.log("Product ID not found")
        }
    }

}

// TESTING:

// let instancia1 = new productManager

// console.log(instancia1.getProducts())

// instancia1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", 25)

// console.log(instancia1.getProducts())

// console.log(instancia1.getProductById(1))
// console.log(instancia1.getProductById(6))

// instancia1.updateProduct(1, "title", "cambio de titulo")
// instancia1.updateProduct(1, "id", 89)

// instancia1.deleteProduct(1)
// instancia1.deleteProduct(999)