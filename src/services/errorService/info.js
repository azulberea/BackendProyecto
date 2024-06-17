export const addProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    *title: expected: String
        recieved: ${product.title}
    *description: expected: String
        recieved: ${product.description}
    *price: expected: Number
        recieved: ${product.price}
    *stock: expected: Number
        recieved: ${product.stock}
    *category: expected: String
        recieved: ${product.category}
    `
}

export const idErrorInfo = (...id) => {

    return `Some of the given ID's ${id.join(", ")} are not associated with an existent resource `

}

export const internalServerErrorInfo = () => {

    return `Internal server error`

}