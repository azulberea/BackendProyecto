import passport from "passport";

export const passportCall = (strategy) => {

    return async(req, res, next) => {

        passport.authenticate(strategy,function(err, user, info){

            if(err) return next(err);

            if(!user) {

                return res.status(401).send({
                    status: "Error",
                    payload: info.messages ? info.messages : info.toString()
                })

            }
            
            req.user = user

            next()

        })(req, res, next)

    }
    
}