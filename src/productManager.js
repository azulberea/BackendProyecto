import fs from "fs" 

export class productManager{
    
    constructor() {
        this.productos = []    
        this.path = "./data/productManager.json"    
        if (!fs.existsSync(this.path)){   
            fs.writeFileSync(this.path, JSON.stringify(this.productos, null, "\t"));
        } else {    
        this.productos = JSON.parse(fs.readFileSync(this.path, "utf8"));   
        }    
    }

    validarProductoExistente(tituloAAgregar){
        return this.productos.some(producto => producto.title == tituloAAgregar)    
    }

    addProduct(title, description, price, stock, category, thumbnails ){
        const getId = ()=> {
            let id = this.productos.length + 1
            return id
        }
        let productoAAgregar = {        
            title: title,
            description: description,
            price: price,
            stock: stock,
            category: category,
            thumbnails: thumbnails ? thumbnails : [],
            status: true,
            id: getId()
        }
        function validarPropiedadesVacias(productoAAgregar) {
            for(let key in productoAAgregar){
                if (productoAAgregar[key] != thumbnails && (productoAAgregar[key] === null || productoAAgregar[key] === undefined || productoAAgregar[key] === '')){
                    return true
                }
            }return false
        }
        if(validarPropiedadesVacias(productoAAgregar)){
            console.error("debes llenar todos los campos")
            return
        }
        if(this.validarProductoExistente(productoAAgregar.title)){
            console.log("Producto existente, intente agregar otro")
            return
        }else{
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
        let file = JSON.parse(fs.readFileSync(this.path, "utf8"));    
        for(let producto of file){    
            if(producto.id == id){    
                return producto  
            }    
        }    
        return "Not found"
    }

    deleteProduct(id){

        let indiceAEliminar = this.productos.findIndex((producto) => producto.id == id);

        if(indiceAEliminar = -1){
            return "Not found"
        }

        this.productos.splice(indiceAEliminar,1)

        fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))
        
    }

    updateProduct(id, productoAModificar, campo, modificacion){

        productoAModificar[campo] = modificacion
        this.deleteProduct(id)
        this.productos.push(productoAModificar)
        fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))
        
    }
}


// TESTING:

// let instancia1 = new productManager

// console.log(instancia1.getProducts())

// instancia1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", 25)
// instancia1.addProduct("producto prueba 2", "Este es un producto prueba", 200, "Sin imagen", 25)
// instancia1.addProduct("producto prueba 3", "Este es un producto prueba", 200, "Sin imagen", 25)
// instancia1.addProduct("azul", "Este es un producto prueba", 200, "Sin imagen", 25)
// instancia1.addProduct("azul", "Este es un producto prueba", 200, "Sin imagen", 25)


// console.log(instancia1.getProducts())

//  console.log(instancia1.getProductById(1))
// console.log(instancia1.getProductById(6))

// instancia1.updateProduct(1, "title", "cambio de titulo")
// instancia1.updateProduct(1, "id", 89)

// instancia1.deleteProduct(1)
// instancia1.deleteProduct(2)
// instancia1.deleteProduct(999)