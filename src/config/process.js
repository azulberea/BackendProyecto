import { Command } from "commander"

const program = new Command()

const validateEnv = (value) => {

    if(value != "development" && value != "production"){
        throw new Error(`El modo debe ser "development" o "production"`)
    }

    return value

}

program
    .requiredOption("-m, --mode <mode>", "Modo de ejecucion de la app (development o production)", validateEnv, "development")
    .parse(process.argv)

export const options = program.opts()

    console.log(`Modo seleccionado: ${options.mode}`)
