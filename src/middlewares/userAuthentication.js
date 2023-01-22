import chalk from "chalk";
import db from "../database/database.js";

export default async function userAuthentication (req, res, next) {
    let auth = req.headers.authorization;
    if(!auth) return res.status(404).send("Usuário não existe!");
    auth = auth.replace("Bearer ", "");

    try {

        const session = await db.collection("sessions").findOne({ token: auth});
        if (!session) return res.status(404).send("Usuário não está logado!");

        res.locals.session = session;
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR CADASTRAR NOVA ENTRADA/SAIDA: ${err}`));
        return res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }

    next();
} 