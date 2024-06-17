import passport from "passport";
import local from "passport-local";

import { createHash, isValidPassword } from "../utils/functionUtils.js";
import { userController } from "../controllers/userController.js";

const localStrategy = local.Strategy

const initializatePassport = ()=>{

    passport.use("register", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        
        async (req, username, password, done) => {

            const {first_name, last_name, email, age} = req.body

            try{

                let user = await userController.getUserByEmail(username)

                if(user){

                    console.log("usuario existente")

                    return done(null, false)

                }
                
                const role = email == "adminCoder@coder.com" ? "admin" : "user"

                const hashPassword = createHash(password)
                
                const result = await userController.addUser(first_name, last_name, email, age, hashPassword, role)

                return done(null, result)

            } catch(error) {

                console.log(error.message)
                return done(error.message)

            }

        }

    ))

    passport.use("login", new localStrategy({usernameField:"email"}, async (username, password, done) => {

        try {

            const user = await userController.getUserByEmail(username)

            if(!user) {

                console.log("usuario inexistente")

                return done(null, false)

            }

            if(!isValidPassword(user, password)) {

                console.log("contraseña o usuario incorrectos")

                return done(null, false)

            }

            return done (null, user)

        }catch(error) {

            console.log(error.message)
            return done(error.message)

        }

    }))

    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser(async (id, done) =>{

        const user = await userController.getUserById(id)

        done(null, user)

    })

}

export default initializatePassport