import dotenv from "dotenv";
dotenv.config()



export const development = {
    mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
    bcrypt_salt_round: +process.env.DEV_BCRYPT_SALT_ROUND,
    port: +process.env.PORT // To convert the port to a number
}
