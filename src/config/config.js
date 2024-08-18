import dotenv from "dotenv";
import { options } from "./process.js";

const environmet = options.mode

dotenv.config({
    path: environmet == "development" ? "./.env.development" : "./.env.production"
});

export default {
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT,
    logger: process.env.LOGGER,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    githubAppID: process.env.GITHUB_APP_ID,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    senderEmail: process.env.EMAIL,
    senderEmailPassword: process.env.EMAIL_PASSWORD
}

