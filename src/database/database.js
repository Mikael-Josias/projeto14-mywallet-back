import chalk from "chalk";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log(chalk.blue.bgBlueBright("BANCO CONECTADO!")); 

} catch (err) {
    console.log(chalk.red.bgRed(`ERRO AO CONECTAR AO BANCO: ${err}`));
}

export default db;