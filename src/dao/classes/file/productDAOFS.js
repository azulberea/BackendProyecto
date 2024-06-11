import fs from "fs" 

export class productManagerFS {
    
    constructor() {

        this.productos = []    

        this.path = "./data/productManagerFS.json"  
        
        !fs.existsSync(this.path) ?

            fs.writeFileSync(this.path, JSON.stringify(this.productos, null, "\t")) :

            this.productos = JSON.parse(fs.readFileSync(this.path, "utf8"))       

    }

    validarProductoExistente(tituloAAgregar) {

        return this.productos.some(producto => producto.title == tituloAAgregar)  

    }

    addProduct( title, description, price, stock, category, status, thumbnails ) {

        const uniqueID = Date.now()

        let productoAAgregar = {        
            title: title,
            description: description,
            price: price,
            stock: stock,
            category: category,
            thumbnails: thumbnails ? thumbnails : [],
            status: status ? status : true,
            id: uniqueID
        }

        function validarPropiedadesVacias(productoAAgregar) {

            for(let key in productoAAgregar) {

                if (productoAAgregar[key] != thumbnails && (productoAAgregar[key] === null || productoAAgregar[key] === undefined || productoAAgregar[key] === '')) {

                    return true

                }

            }
            
            return false

        }

        if(validarPropiedadesVacias(productoAAgregar)) {

            console.error("debes llenar todos los campos")

            return "emptyProperties"

        }

        if(this.validarProductoExistente(productoAAgregar.title)) {

            console.error("Producto existente, intente agregar otro")

            return "existingProduct"

        }else {

            this.productos.push(productoAAgregar)

            fs.existsSync(this.path) &&

            fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))

        }

    }

    getProducts() {

        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))

        return file

    }

    getProductById(id) {

        let file = JSON.parse(fs.readFileSync(this.path, "utf8"))

        for(let producto of file) {   

            if(producto.id == id) {    

                return producto  

            }   

        }   

        return "Not found"

    }

    deleteProduct(id) {

        let indiceAEliminar = this.productos.findIndex((producto) => producto.id == id)

        indiceAEliminar == -1 ?

            "Not found" :

            this.productos.splice(indiceAEliminar,1)

            fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))

    }

    updateProduct(id, productoAModificar, campo, modificacion) {

        productoAModificar[campo] = modificacion

        this.deleteProduct(id)

        this.productos.push(productoAModificar)

        fs.writeFileSync(this.path, JSON.stringify(this.productos,null,"\t"))

    }
    
}

export const PMFS = new productManagerFS