// tratar de poner los dos middlewares en uno

export const roleAuth = (role) => {

    return async (req, res, next) => {

        if(!req.user) return res.status(401).send({status:"Error",
            payload:"Unauthenticated"})

        if(req.user.role != role && role != "all"){

            return res.status(403).send({status: "Error",
            payload: "Unauthorized"
            })

        }         

        next()
        
    }

}

export const premiumAuth = () => {

    return async (req, res, next) => {

        if(!req.user) return res.status(401).send({status:"Error",
            payload:"Unauthenticated"})

        if(!req.user.premium){

            return res.status(403).send({status: "Error",
            payload: "No autorizado. Debes ser premium para acceder a esta ruta"
            })

        }         

        next()
        
    }

}