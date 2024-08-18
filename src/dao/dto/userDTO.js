export default class userDTO {
    constructor (user) {
        this.full_name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.membership = user.premium ? "premium" : "normal"
    }
}