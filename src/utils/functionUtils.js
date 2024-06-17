import bcrypt from "bcrypt"
import { fakerES as faker } from '@faker-js/faker';

export const createHash = (password) => {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))

}

export const isValidPassword = (user, password) =>{

    return bcrypt.compareSync(password, user.password)

}

export const createProduct = ()=>{

    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int(100),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        _id: faker.database.mongodbObjectId()
    }

}