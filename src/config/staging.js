import dotenv from "dotenv";
dotenv.config()



export const staging = {
    mongodb_connection_url: process.env.STAGING_MONGODB_CONNECTION_URL,
    port: +process.env.PORT // To convert the port to a number
}