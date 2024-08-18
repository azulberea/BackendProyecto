import passport from "passport";
import local from "passport-local";
import jwt, { ExtractJwt } from "passport-jwt";
import moment from "moment";
import GitHubStrategy from "passport-github2"

import config from "./config.js";
import {fileURLToPath} from "url"
import { createHash, isValidPassword } from "../utils/functionUtils.js";
import { userController } from "../controllers/userController.js";
import { defineLogger } from "../utils/logger.js";
import { cookieExtractor } from "../utils/cookieUtils.js";

const { jwtSecretKey, githubAppID, githubClientID, githubClientSecret } = config

const localStrategy = local.Strategy

const JWTStrategy = jwt.Strategy

const extractJWT = jwt.ExtractJwt

const initializatePassport = ()=>{

    passport.use("register", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        
        async (req, username, password, done) => {

            const {first_name, last_name, email, age, type_of_user} = req.body

            try{

                let user = await userController.getUserByEmail(username)

                if(user){

                    defineLogger.info(`No se pudo crear el usuario porque el email esta asociado a una cuenta existente`)

                    return done(null, false, {messages:"Email associated to an existen account"})

                }

                if(!email){

                    defineLogger.warn(`No se pudo crear el usuario porque debes proporcionar un email`)

                    return done(null, false, {messages:"Not email provided"})

                }
                
                const role = email == "adminCoder@coder.com" ? "admin" : "user"

                let premium

                if(role == "admin" || type_of_user == "normal"){
                
                    premium = false

                }else{

                    premium = true

                }

                const hashPassword = createHash(password)
                
                const result = await userController.addUser(first_name, last_name, email, age, hashPassword, role, premium)

                const resultObj = await userController.getUserObjectByEmail(email)

                req.user = resultObj

                return done(null, resultObj)

            } catch(error) {

                defineLogger.fatal(`level FATAL at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
                message: ${error.message}`)

                return done(error.message)

            }

        }

    ))

    passport.use("login", new localStrategy({usernameField:"email"}, async (username, password, done) => {

        try {

            const user = await userController.getUserObjectByEmail(username)

            if(!user) {

                defineLogger.info(`No existe un usuario con ese email`)

                return done(null, false, {messages: "Email not associated with an existing user"})

            }

            if(!isValidPassword(user, password)) {

                defineLogger.info(`Usuario o contraseña incorrectos`)

                return done(null, false, {messages: "Wrong user or password"})

            }

            if(!user.status){

                defineLogger.info(`Usuario inactivo`)

                throw new Error("Usuario desativado por inactividad")
            }

            return done (null, user)

        }catch(error) {

            defineLogger.fatal(`level FATAL at ${fileURLToPath(import.meta.url)} on ${moment().format('MMMM Do YYYY, h:mm:ss a')}
            message: ${error.message}`)
            
            return done(error.message)

        }

    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwtSecretKey
    }, async(jwt_payload, done)=>{

        try{

            return done(null,jwt_payload)

        }catch(error){

            return done(error)

        }
    }))

    // passport.use(
    //     "github",
    //     new GitHubStrategy({
    //         clientID: githubClientID,
    //         clientSecret: githubClientSecret,
    //         callbackURL: "http://localhost:8080/api/sessions/githubCallback"
    // },
    // async (accessToken, refreshToken, profile, done) => {
    //     try {

    //         let user = await userController.getUserByEmail(profile._json.login)

    //         if(!user) {

    //             let newUser = {
    //                 first_name: profile._json.name,
    //                 password: ""
    //             }

    //             console.log(profile._json.name)

    //             let result = await userController.addGithubUser(newUser)

    //             done(null, result)

    //         } else {

    //             done(null, user)

    //         }

    //     } catch(error) {

    //         return done(error)

    //     }

    // }))

    // passport.serializeUser((user, done) => done(null, user._id))

    // passport.deserializeUser(async (id, done) =>{

    //     const user = await userController.getUserById(id)

    //     done(null, user)

    // })

}

export default initializatePassport