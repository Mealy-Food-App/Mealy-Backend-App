import dotenv from "dotenv";
dotenv.config()



export const development = {
    mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
    port: +process.env.PORT // To convert the port to a number
}