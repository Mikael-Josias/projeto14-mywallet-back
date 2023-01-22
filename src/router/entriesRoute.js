import express from "express";
import { getEntries, saveEntrie } from "../controllers/entriesController.js";
import userAuthentication from "../middlewares/userAuthentication.js";

const entriesRoute = express.Router();

entriesRoute.use(userAuthentication);

entriesRoute.post("/entries", saveEntrie);
entriesRoute.get("/entries", getEntries);

export default entriesRoute;