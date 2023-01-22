import express from "express";
import { signInUser } from "../controllers/userController.js";

const signInRoute = express.Router();

signInRoute.post("/signin", signInUser);

export default signInRoute;