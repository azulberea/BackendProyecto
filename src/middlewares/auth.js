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

export const authAdmin = (req, res, next)=>{

    if(req.session.user.role == "user"){

        return res.redirect("/products")

    }

    return next()
}

export const authUser = (req, res, next)=> {

    if(req.session.user.role == "admin"){

        return res.redirect("/realTimeProducts")

    }

    return next()
    
}