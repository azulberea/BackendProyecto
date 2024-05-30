import mongoose from "mongoose";

const usersCollection = "users"

const userSchema = mongoose.Schema({

    first_name:{
        type: String,
        require: true,
    },
    last_name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        minlength: 3,
        unique: true
    },
    age:{
        type: Number,
        require: true,
    },
    password:{
        type: String,
        require: true,
        minlength: 3
    }
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel