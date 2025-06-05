import express from "express";
import dotenv from "dotenv";
import {initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js"
import transactionRoutes from "./routes/transactionsRoutes.js"
import job from "./config/cron.js"

dotenv.config();
const PORT = process.env.PORT;
if(process.env.NODE_ENV==="production")job.start();
const app = express();
app.use(rateLimiter)
app.use(express.json());

app.use("/api/transactions",transactionRoutes)

initDB().then(()=>{
app.listen(PORT,()=>{
    console.log("App is running at Port :",PORT);
});
});
