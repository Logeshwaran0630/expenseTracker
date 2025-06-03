import { sql } from "../config/db.js";

export async function getTransactionByid(req,res){
     try {
            const {userId}=req.params;
       const t1 = await sql`
            SELECT * FROM TRANSACTIONS WHERE user_id=${userId} ORDER BY created_at DESC`
            res.status(200).json(t1);
        } catch (error) {
             console.log("rror occured",error)
        res.status(500).json({message: "internal error"});
        }
    }
    export async function deleteTransaction(req,res){
          try {
            const { id } = req.params;
        
            if (isNaN(parseInt(id))) {
              return res.status(400).json({ message: "Invalid transaction ID" });
            }
        
            const deleted = await sql`
              DELETE FROM transactions WHERE id = ${id}
              RETURNING *
            `;
        
            if (deleted.length === 0) {
              return res.status(404).json({ message: "Transaction not found" });
            }
        
            res.status(200).json({ message: "Transaction deleted", data: deleted[0] });
          } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ message: "Internal server error" });
          }
        
    }

    export async function createTransaction(req,res){
try {
    const { title,amount,category,user_id}=req.body;
    if(!title || !category || !user_id || amount === undefined){
        return res.status(400).json({message: "All fields are required"});
    }
   const transaction = await sql`
    INSERT INTO transactions(user_id,title,amount,category)
    VALUES (${user_id},${title},${amount},${category})
    RETURNING *
    `;
    console.log(transaction);
    res.status(201).json(transaction);

} catch (error) {
    console.log("error occured",error)
    res.status(500).json({message: "internal error"});
}
}

export async function summaryTransaction(req,res) {
    try {
        const { userId } = req.params;
    
        const balanceRes = await sql`
          SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `;
        const incomeRes = await sql`
          SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;
        const expenseRes = await sql`
          SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;
    
        res.status(200).json({
          balance: balanceRes[0].balance,
          income: incomeRes[0].income,
          expense: expenseRes[0].expense
        });
      } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }