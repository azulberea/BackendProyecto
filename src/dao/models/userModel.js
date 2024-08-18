import mongoose from "mongoose";

const usersCollection = "users"

const userSchema = mongoose.Schema({

    first_name:{
        type: String,
        require: true
    },
    last_name:{
        type: String,
        require: true 
    },
    email:{
        type: String,
        require: true,
        minlength: 3,
        unique: true
    },
    age:{
        type: Number,
        require: false,
    },
    password:{
        type: String,
        require: true,
        minlength: 3
    },
    role:{
        type:String,
        require: true
    },
    premium:{
        type:Boolean,
        require: true
    },
    cart:{
        type: mongoose.Schema.ObjectId,
        ref: "carts"
    },
    documents:{
        type: [
            {
                name:{
                    type: String
                },
                reference:{
                    type: String
                }
            }
        ],
        default: []
    },
    last_connection:{
        type: Date,
        default: null
    },
    status:{
        type: Boolean,
        default: true
    }
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel