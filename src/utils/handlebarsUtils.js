import {create} from "express-handlebars" 

const hbs = create()

hbs.handlebars.registerHelper('eq', function (a, b) {
    return a == b 
})

hbs.handlebars.registerHelper('or', function (a, b) {
    return a || b;
})

export default hbs