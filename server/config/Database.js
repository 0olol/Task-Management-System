import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config()
// console.log(process.env.HOST)

const db = new Sequelize('nodelogin', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    user: "root",
    password: "root"
});
 
export default db;