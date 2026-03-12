const express = require("express")
const router = express.Router()

const sf = require("../integrations/salesforceClient")

/*
GET ACCOUNT BY NAME
*/

router.get("/account/:name", async (req,res)=>{

try{

const acc = await sf.getAccountByName(req.params.name)

res.json(acc)

}catch(error){

console.error("Error fetching account:",error)

res.status(500).json({
error:error.message
})

}

})



/*
CREATE ACCOUNT
*/

router.post("/account", async (req,res)=>{

try{

const duplicate = await sf.getAccountByName(req.body.Name)

if(duplicate){

return res.json({
duplicate:true,
account:duplicate
})

}

const result = await sf.createAccount(req.body)

res.json(result)

}catch(error){

console.error("Error creating account:",error)

res.status(500).json({
error:error.message
})

}

})



/*
NEW ROUTE
GET ALL ACCOUNTS
*/

router.get("/accounts", async (req,res)=>{

try{

const accounts = await sf.getAllAccounts()

res.json({
accounts
})

}catch(error){

console.error("Error fetching all accounts:",error)

res.status(500).json({
error:error.message
})

}

})


module.exports = router