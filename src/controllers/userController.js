import { cartController } from "./cartController.js";
import UserService from "../dao/classes/mongo/userDAOMongo.js";
import userModel from "../dao/models/userModel.js";

export class UserController {

    constructor() {

        this.userService = new UserService()

    }

    async addUser(first_name, last_name, email, age, password, role) {

        if( !first_name || !last_name || !email || !age || !password ){

            console.log(`-UC asegurate de completar todos los campos`)

            return null

        }

        try {

            const userExisting = await userModel.findOne({email: email})

            if(userExisting){

                console.log(`UC usuario existente`)

                return null 

            }

            const user = {
                first_name,
                last_name,
                email,
                age, 
                password,
                role,
                cart: email != "adminCoder@coder.com" ? await cartController.createCart() : null
            }

            const result = await this.userService.add(user)

            return result

        }catch(error) {

            console.log(error.message)
            
            return null
        
        }

    }

    async getUserByEmail(email) {

        try{

            const result = await this.userService.getByEmail(email)

            return result

        }catch(error) {

            console.log(error.message)
            
            return null
        
        }

    }

    async getUserById(id) {

        try{

            const result = this.userService.getById(id)

            return result 

        }catch(error) {

            console.log(error.message)
            
            return null
        
        }
    }

}

export const userController = new UserController()