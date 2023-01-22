import express from "express";
import { signUpUser } from "../controllers/userController.js";

const signUpRoute = express.Router();

signUpRoute.post("/signup", signUpUser);

export default signUpRoute;