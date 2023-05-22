import dotenv from "dotenv";
dotenv.config()


export const production = {
    mongodb_connection_url: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
    port: +process.env.PORT // To convert the port to a number
}