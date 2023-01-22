import bcrypt from 'bcrypt';
import chalk from 'chalk';
import { v4 as uuid } from 'uuid';
import db from "../database/database.js";
import { signinSchema } from "../schemas/signInSchema.js";
import { signupSchema } from "../schemas/signUpSchema.js";

export async function signInUser(req, res) {
    const {error, value} = signinSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).send(error);

    try {
        const user = await db.collection("users").findOne({email: value.email});
        if (!user || !bcrypt.compareSync(value.password, user.password)) return res.status(404).send("Usuário não existe!");

        const token = uuid();

        await db.collection("sessions").insertOne({
            userId: user._id,
            token,
        });

        res.send({name: user.name, token});
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR LOGAR: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
}

export async function signUpUser(req, res) {
    const {error, value} = signupSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).send(error);

    try {
        const emailAlredUsed = await db.collection("users").findOne({email: value.email});
        if (emailAlredUsed) return res.status(409).send("Email já cadastrado!");

        value.password = bcrypt.hashSync(value.password, 10);

        await db.collection("users").insertOne({...value});
        res.status(201).send("Novo usuário cadastrado com sucesso!"); 
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR CADASTRAR: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
}
