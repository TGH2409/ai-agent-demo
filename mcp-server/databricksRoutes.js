const express = require("express")
const router = express.Router()

const db = require("../integrations/databricksClient")

router.get("/orders/:accountId", async (req,res)=>{

try{

const orders = await db.getOrders(req.params.accountId)

console.log("📦 Orders returned:", orders.length)

res.json({
orders
})

}catch(err){

console.error("Databricks error:", err)

res.status(500).json({
error: err.message
})

}

})

module.exports = router