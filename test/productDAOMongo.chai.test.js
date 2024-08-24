import mongoose from "mongoose";
import * as chai from 'chai';

import ProductService from "../src/dao/classes/mongo/productDAOMongo.js";
import config from "../src/config/config.js";

const { mongoUrl } = config

const { expect } = chai

//ANTES DE REALIZAR EL TESTING, CAMBIAR EL NOMBRE DE LA COLECCION "PRODUCTS" EN ../SRC/DAO/MODELS/PRODUCTMODEL.JS POR "PRODUCTS_TEST" 
mongoose.connect(mongoUrl)

const testProduct = {title: "Producto de prueba 1", 
    description: "Descripcion de producto de prueba 1",
    price: 50,
    stock: 100,
    category: "Categoria 1"
}

const productDAO = new ProductService()

describe("Tests de productDAO", function() {

    before( () => {
        mongoose.connection.collection("products_test").drop()
    })

    beforeEach( () => {
        this.timeout = 3000
    })

    after( () => {
        mongoose.connection.collection("products_test").drop()
    })

    it("add() debe crear un producto en la base de datos y retornarlo, creando correctamente las propiedades que no se le hayan pasado (owner: adminCoder@coder.com, thumbnails: [], status: true", async () => {

        const result = await productDAO.add(testProduct)

        expect(result).to.be.an("object")
        expect(result.owner).to.be.equal("adminCoder@coder.com")
        expect(result.thumbnails).to.be.deep.equal([])
        expect(result.status).to.be.equal(true)

    })

    it("getByTitle() debe retornar un producto que coincida con el titulo proporcionado", async () => {

        const result = await productDAO.getByTitle("Producto de prueba 1")

        expect(result).to.be.an("object")
        expect(result._id).to.be.not.null
        expect(result.title).to.be.a("string")

    })

    it("getAll() debe retornar un array con todos los productos de la coleccion", async () => {

        const result = await productDAO.getAll()

        expect(result).to.be.an("array")

    })

    it("update() debe buscar un producto en la base de datos por su id y actualizarlo", async () => {

        const product = await productDAO.getByTitle("Producto de prueba 1")

        const result = await productDAO.update(product._id, {title: "Update de prod de prueba 1"})

        expect(result.acknowledged).to.be.equal(true)
        expect(result.modifiedCount).to.be.equal(1)
    })

    it("delete() debe buscar un producto en la base de datos por su id y eliminarlo", async () => {

        const product = await productDAO.getByTitle("Update de prod de prueba 1")

        const result = await productDAO.delete(product._id)

        expect(result.deletedCount).to.be.equal(1)
    })
})