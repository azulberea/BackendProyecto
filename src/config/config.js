import dotenv from "dotenv";
import { options } from "./process.js";

const environmet = options.mode

dotenv.config({
    path: environmet == "development" ? "./.env.development" : "./.env.production"
});

export default {
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT,
    logger: process.env.LOGGER
}

