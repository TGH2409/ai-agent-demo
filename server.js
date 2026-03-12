const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const detectIntent = require("./agent/planner")
const tools = require("./agent/tools")

const app = express()

app.use(cors())          // ⭐ important
app.use(bodyParser.json())

app.post("/chat", async (req, res) => {
  const message = req.body.message

  const intent = await detectIntent(message)

  if (intent.intent === "get_account_details") {

  const accountName = intent.fields.Name

  const account = await tools.getAccountDetails(accountName)

  return res.json({ account })

}

if (intent.intent === "update_account") {

  const name = intent.fields.Name

  const fields = { ...intent.fields }
  delete fields.Name

  const result = await tools.updateAccount(name, fields)

  return res.json(result)

}

  if (intent.intent === "create_account") {
    const result = await tools.createAccount(intent.fields)
    return res.json(result)
  }

 if(intent.intent === "get_all_accounts"){

    const result = await tools.getAllAccounts()

    console.log("📦 Accounts response from tools:", result)

    return res.json({
        accounts: result.accounts || result
    })

}

  if (intent.intent === "get_orders") {

  let accountName = intent.fields?.Name

  // fallback if LLM fails
  if (!accountName) {

    const match = message.match(/for (.+)$/i)

    if (match) {
      accountName = match[1]
    }

  }

  console.log("Searching account:", accountName)

  const account = await tools.getAccountByName(accountName)

  if (!account) {
    return res.json({ error: "Account not found" })
  }

  const orders = await tools.getOrders(account.Id)

  return res.json({
    account,
    orders
  })
}

  res.json({ message: "Unknown intent" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`AI Agent running on ${PORT}`)
})