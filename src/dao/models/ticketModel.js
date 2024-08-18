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
        require: true,
    },
    products:{
        type:[
            {
                product:{
                    type: String
                },
                quantity:{
                    type: Number
                },
                _id:{
                    type: mongoose.Schema.ObjectId
                },
                price:{
                    type: Number
                }
            }
        ]
    },
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