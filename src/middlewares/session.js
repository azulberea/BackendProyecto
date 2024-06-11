import MongoStore from "connect-mongo"
import session from "express-session"
import config from "../config/config.js"

const { mongoUrl } = config

export const sessionMiddleware = session(
    {
        store: MongoStore.create(
            {
                mongoUrl: mongoUrl,
                ttl: 300
            }
        ),
        secret: "secretPhrase",
        resave: true,
        saveUninitialized: true
    }
)