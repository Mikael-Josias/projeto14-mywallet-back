import express from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import SignIn from "./router/signInRoute.js";
import SignUp from "./router/signUpRoute.js";
import Entries from "./router/entriesRoute.js";


dotenv.config();

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(SignIn);
app.use(SignUp);
app.use(Entries);


app.listen(PORT, () => {
    console.log(chalk.black.bgGreenBright("🚀!SERVER INICIALIZADO!🚀"));
});