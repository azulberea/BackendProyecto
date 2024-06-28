import winston from "winston"
import config from "../config/config.js"
import moment from "moment"

const { logger } = config

const customLevels = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: "black",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
}

winston.addColors(customLevels.colors)

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level:"debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./logs/errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level:"info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./logs/errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

export const defineLogger = logger == "prodLogger" ? prodLogger : devLogger

export const addLogger = (req, res, next) => {
    req.logger = defineLogger
    next()
}