import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const mockProductsCollection = "mock products"

const mockProductSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    stock:{
        type: Number,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    status:{
        type: Boolean,
        require: false,
        default: true
    },
    thumbnails:{
        type: Array,
        require: false,
        default: []
    }
})

productSchema.plugin(mongoosePaginate)

export const mockProductModel = mongoose.model(mockProductsCollection, mockProductSchema)