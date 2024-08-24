import * as chai from "chai"
import supertest from "supertest"
import mongoose from "mongoose"

const { expect } = chai

const requester = supertest("http://localhost:8080")

    
const product = {title: "Producto de prueba 1", 
    description: "Descripcion de producto de prueba 1",
    price: 50,
    stock: 100,
    category: "Categoria 1"
}

//AL IGUAL QUE EL MODULO DE TESTING UNITARIO, ANTES DE REALIZAR ESTE TESTING VERIFICAR QUE EL NOMBRE DE LA COLECCION "PRODUCTS" EN ../SRC/DAO/MODELS/PRODUCTMODEL.JS SEA "PRODUCTS_TEST" 
describe("Testing beyond supplements", function() {

    describe("Testing de router de productos", function() {

        this.timeout(5000)        

        let productId

        it("El endpoint POST /api/products debe crear un producto en la base de datos", async () => {
            
            const result = await requester.post("/api/products").send(product)
    
            expect(result.statusCode).to.be.equal(201)
            expect(result.ok).to.be.equal(true)
            expect(result.body.payload).to.have.property("_id")
            expect(result.body.payload).to.have.property("owner").to.be.equal("adminCoder@coder.com")
            expect(result.body.payload).to.have.property("status").to.be.equal(true)
            expect(result.body.payload).to.have.property("thumbnails").to.be.an("array")

            productId = result.body.payload._id

        })

        it("El endpoint GET /api/products debe obtener todos los productos de la base de datos", async () => {

            const result = await requester.get("/api/products").send()

            expect(result.statusCode).to.be.equal(200)
            expect(result.ok).to.be.equal(true)
            expect(result.body).to.have.property("status").to.be.equal("Success")
            expect(result.body).to.have.property("payload").to.be.an("array")
            expect(result.body.payload[0]).to.be.an("object").to.have.property("_id")
        })

        it("El endpoint GET /api/products/product/:productid debe obtener un producto por su id", async () => {

            const result = await requester.get(`/api/products/product/${productId}`).send()

            expect(result.statusCode).to.be.equal(200)
            expect(result.ok).to.be.equal(true)
            expect(result.body).to.have.property("status").to.be.equal("Success")
            expect(result.body).to.have.property("payload").to.be.an("object").to.have.property("_id").to.be.equal(productId)
        })

        it("El endpoint GET /api/products/title/:title debe obtener un producto por su titulo", async () => {

            const result = await requester.get(`/api/products/title/${product.title}`).send()

            expect(result.statusCode).to.be.equal(200)
            expect(result.ok).to.be.equal(true)
            expect(result.body).to.have.property("status").to.be.equal("Success")
            expect(result.body).to.have.property("payload").to.be.an("object").to.have.property("title").to.be.equal(product.title)

        })

        it("El endpoint PUT /api/products/product/:productid debe modificar un producto y retornarlo actualizado", async () => {

            const result = await requester.put(`/api/products/product/${productId}`).send({title: "Update de producto de prueba 1"}) //CAMBIAR EL PARAM POR ${productId}

            expect(result.statusCode).to.be.equal(200)
            expect(result.ok).to.be.equal(true)
            expect(result.body).to.have.property("status").to.be.equal("Success")
            expect(result.body).to.have.property("payload").to.be.an("object").to.have.property("_id").to.be.equal(productId) //CAMBIAR POR PRODUCTID
            expect(result.body.payload).to.have.property("title").to.not.be.equal("Producto de prueba 1")
            
        })

        it("El endpoint DELETE /api/products/product/:productid debe eliminar un producto a traves de su id", async () => {

            const result = await requester.delete(`/api/products/product/${productId}`).send()

            expect(result.statusCode).to.be.equal(200)
            expect(result.ok).to.be.equal(true)
            expect(result.body).to.have.property("status").to.be.equal("Success")
            expect(result.body).to.have.property("payload").to.be.an("object").to.have.property("acknowledged").to.be.equal(true)
            expect(result.body.payload).to.have.property("deletedCount").to.be.equal(1)

        })
    })

})
