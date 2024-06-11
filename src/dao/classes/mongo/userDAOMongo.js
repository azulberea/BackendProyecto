import userModel from "../../models/userModel.js";

export default class UserService {

    async add(user) {

        try{

            const result = await userModel.create(user)

            return result

        }catch(error){

            console.log(error.message)

            return null

        }

    }

    async getByEmail(email) {

        try{

            const result = await userModel.findOne({email:email})

            return result

        }catch(error) {

            console.log(error.message)
            
            return null
        
        }

    }

    async getById(id) {

        try{

            const result = await userModel.findById(id)

            return result 

        }catch(error) {

            console.log(error.message)
            
            return null
        
        }
        
    }
    
}