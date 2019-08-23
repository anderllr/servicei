//This file is used for storage information that I need in all system
// Or to keep information safe
//You have to create your own .env file with your secret information like example:
/*

AUTH_SECRET= 'gooddddexplanation'
GEN_SALT_NUMBER= 10

*/
const env = require("dotenv").config();

export const JWT_SECRET = process.env.AUTH_SECRET;
export const GEN_SALT_NUMBER = process.env.GEN_SALT_NUMBER;
export const ADMIN_USER = process.env.ADMIN_USER;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const MONGO_USER = process.env.MONGO_USER;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
export const MONGODB_URI = process.env.MONGO_URI;

//Email Variables
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_SECURE = process.env.EMAIL_SECURE;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_FROM = process.env.EMAIL_FROM;

//Encryption
export const KEY_FOR_ENCRYPTION = process.env.KEY_FOR_ENCRYPTION;
