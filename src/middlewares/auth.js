export const auth = (req, res, next)=>{

    if(!req.session.user){

        return res.redirect("/login")

    }

    return next()

}

export const authLogged = (req, res, next)=>{

    if(req.session.user){

        return res.redirect("/profile")

    }

    return next()
    
}
