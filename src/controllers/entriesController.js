import chalk from "chalk";
import dayjs from "dayjs";
import {entriesSchema} from "../schemas/entriesSchema.js";
import db from "../database/database.js";

export async function saveEntrie(req, res) {
    try {
        const user = await db.collection("users").findOne({ _id: res.locals.session.userId});
        console.log(user);
        if (!user) return res.status(404).send("Usuário não existe!");

        const {error, value} = entriesSchema.validate({
            description: req.body.description,
            price: Number(req.body.value),
            type: req.body.type,
        },{ abortEarly: false });
        if (error) return res.status(400).send(error);
    

        await db.collection("entries").insertOne({ 
            userId: user._id,
            description: value.description,
            price: value.price,
            type: value.type,
            date: dayjs().format("DD/MM"),
        });

        res.status(201).send("Nova entrada cadastrada com sucesso!");
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR CADASTRAR NOVA ENTRADA/SAIDA: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
}

export async function getEntries (req, res) {
    try {
        const entries = await db.collection("entries").find({userId: res.locals.session.userId}).toArray();
        if (!entries) return res.status(404).send("Não há entradas ou saidas para este usuário!");

        console.log(entries);
        res.send(entries);
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR RETORNAR TODAS AS ENTRADAS/SAIDAS: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
}