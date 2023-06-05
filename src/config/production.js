import dotenv from "dotenv";
dotenv.config()


export const production = {
    mongodb_connection_url: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
    bcrypt_salt_round: +process.env.DEV_BCRYPT_SALT_ROUND,
    jwt_key: process.env.JWT_SECRET,
    port: +process.env.PORT // To convert the port to a number
}