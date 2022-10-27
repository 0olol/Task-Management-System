import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config()
// console.log(process.env.HOST)

const db = new Sequelize('nodelogin', 'root', 'root', {
    // host: "localhost",
    host: process.env.HOST,
    // port:"3306",
    dialect: "mysql",
    user: process.env.USER,
    password: process.env.PASSWORD
});
 
export default db;


// process.env.REFRESH_TOKEN_SECRET