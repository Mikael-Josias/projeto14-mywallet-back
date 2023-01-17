import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dayjs from "dayjs";
import Joi from "joi";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

//==================== SCHEMAS ====================\\

const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const signupSchema = Joi.object({
    name: Joi.string().min(2).max(25).trim(false).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(18).alphanum().required(),
});

const entriesSchema = Joi.object({
    userId: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().valid("incoming", "outgoing").required(),
});

//==================== SERVER ====================\\

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

let mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log(chalk.blue.bgBlueBright("BANCO CONECTADO!")); 
} catch (err) {
    console.log(chalk.red.bgRed(`ERRO AO CONECTAR AO BANCO: ${err}`));
}

//=================== ROUTES ====================\\

app.post("/signin", async (req, res) => {
    const {error, value} = signinSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).send(error);

    try {
        const user = await db.collection("users").findOne({ email: value.email, password: value.password});
        if (!user) return res.status(404).send("Usuário não existe!");

        res.send(user.name);
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR LOGAR: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
});

app.post("/signup", async (req, res) => {
    const {error, value} = signupSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).send(error);

    try {
        const emailAlredUsed = await db.collection("users").findOne({email: value.email});
        if (emailAlredUsed) return res.status(409).send("Email já cadastrado!");

        await db.collection("users").insertOne({...value});
        res.status(201).send("Novo usuário cadastrado com sucesso!"); 
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR CADASTRAR: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
});

app.post("/entries", async (req, res) => {
    const {error, value} = entriesSchema.validate({
        userId: req.headers.userid,
        description: req.body.description,
        price: Number(req.body.price),
        type: req.body.type
    },{ abortEarly: false });
    if (error) return res.status(400).send(error);

    try {
        const user = await db.collection("users").findOne({ _id: ObjectId(value.userId)});
        if (!user) return res.status(404).send("Usuário não existe!");

        await db.collection("entries").insertOne({ 
            userId: ObjectId(value.userId),
            description: value.description,
            price: value.price,
            type: value.type
        });

        res.status(201).send("Nova entrada cadastrada com sucesso!");
    } catch (err) {
        console.log(chalk.red(`ERRO AO TENTAR CADASTRAR NOVA ENTRADA/SAIDA: ${err}`));
        res.status(500).send("Desculpe, parece que houve um problema no servidor!");
    }
});

app.listen(PORT, () => {
    console.log(chalk.black.bgGreenBright("🚀!SERVER INICIALIZADO!🚀"));
});