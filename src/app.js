import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import Joi from "joi";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(chalk.black.bgGreenBright("🚀!SERVER INICIALIZADO!🚀"));
});