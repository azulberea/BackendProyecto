import nodemailer from "nodemailer"
import config from "../config/config.js"

const { senderEmail, senderEmailPassword } = config

export const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: senderEmail,
        pass: senderEmailPassword
    }
})