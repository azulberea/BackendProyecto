import dotenv from "dotenv";

const environmet = "development"

dotenv.config({
    path: environmet === "development" ? "./.env.development" : "otro"
});

export default {
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT
}