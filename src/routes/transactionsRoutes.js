import express from "express";
import { sql } from "../config/db.js";
import {summaryTransaction,createTransaction,getTransactionByid,deleteTransaction} from "../controllers/transactionController.js"
const router = express.Router();


router.get("/:userId",getTransactionByid)
router.delete("/:id",deleteTransaction);
router.post("/",createTransaction);
router.get("/summary/:userId",summaryTransaction);

export default router;