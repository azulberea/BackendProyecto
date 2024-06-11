import mongoose from "mongoose";

const ticketsCollection = "tickets"

const ticketSchema = mongoose.Schema({

    code:{
        type: String,
        require: true
    },
    purchase_datetime:{
        type: String,
        require: true,
    },
    cart:{
        type: mongoose.Schema.ObjectId,
        ref: "carts",
        require: true
    }
    ,
    amount:{
        type: Number,
        require: true,
    },
    purchaser:{
        type: String,
        ref: "users",
        require: true
    }

})

const ticketModel = mongoose.model(ticketsCollection, ticketSchema)

export default ticketModel