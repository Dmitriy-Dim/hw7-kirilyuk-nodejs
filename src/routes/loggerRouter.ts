import express from "express";
import {myLogger} from "../utils/logger.ts";


export const loggerRouter = express.Router()
loggerRouter.get('/', (req, res) => {
    const logs = myLogger.getLogArray();
    res.json(logs);
})