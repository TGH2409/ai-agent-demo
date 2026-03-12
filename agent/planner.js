const askLLM = require("./agent")

async function detectIntent(message) {

  const prompt = `
You are an AI agent controlling Salesforce and Databricks.

Extract intent and fields from the user message.

Supported intents:
create_account
get_orders
get_account_details
update_account
get_all_accounts

Examples:

User: Show orders for Alpha Technologies
{
 "intent":"get_orders",
 "fields":{"Name":"Alpha Technologies"}
}

User: Show account details for Beta Solutions
{
 "intent":"get_account_details",
 "fields":{"Name":"Beta Solutions"}
}

User: Update account Beta Solutions phone to 1234567890
{
 "intent":"update_account",
 "fields":{
   "Name":"Beta Solutions",
   "Phone":"1234567890"
 }
}

User: Show all accounts
{
 "intent":"get_all_accounts",
 "fields":{}
}

User: List all accounts
{
 "intent":"get_all_accounts",
 "fields":{}
}

Return ONLY JSON.

User message:
${message}
`

  const response = await askLLM(prompt)

  const jsonMatch = response.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    return { intent: "unknown", fields: {} }
  }

  return JSON.parse(jsonMatch[0])
}

module.exports = detectIntent