import jwt from "jsonwebtoken";
import config from "../config/config.js";

//modulo en desuso, refactorizar codigo para usarlo

const { jwtSecretKey } = config

export const generateToken = (user) =>{

    const token = jwt.sign(
        {user},
        jwtSecretKey,
        { expiresIn: "2h"}
    )

    return token 

}

export const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (authHeader) {
        return res.status(403).send({
            status: "Error",
            payload: "Not authenticated"
        })

    }

    const token = authHeader.split(" ")[1]
    
    jwt.verify(token, jwtSecretKey, (error, credentials) => {
        if(error){
            return res.status(403).send({
                status: "Error",
                payload: "Not authenticated"
            })
        }

        req.user = credentials.user
        next()

    })

}