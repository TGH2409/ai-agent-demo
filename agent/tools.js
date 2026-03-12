const axios = require("axios")

const MCP = process.env.MCP_SERVER_URL

/*
Get Salesforce account by name
*/
async function getAccountByName(name) {

  console.log("🔎 Searching account:", name)

  const res = await axios.get(
    `${MCP}/salesforce/account/${encodeURIComponent(name)}`
  )

  return res.data
}

async function getAllAccounts() {

  console.log("📋 Fetching all accounts")

  const res = await axios.get(
    `${MCP}/salesforce/accounts`
  )

  return res.data
}

/*
Create Salesforce account
*/
async function createAccount(fields) {

  console.log("🆕 AI fields received:", fields)

  const payload = {
    Name: fields.Name || fields.company_name || fields.name,
    Industry: fields.Industry,
    Type: fields.Type,
    Phone: fields.Phone,
    Website: fields.Website,
    BillingStreet: fields.BillingStreet,
    BillingCity: fields.BillingCity,
    BillingState: fields.BillingState,
    BillingPostalCode: fields.BillingPostalCode,
    BillingCountry: fields.BillingCountry,
    AnnualRevenue: fields.AnnualRevenue,
    NumberOfEmployees: fields.NumberOfEmployees,
    AccountSource: fields.AccountSource,
    Description: fields.Description
  }

  console.log("📤 Salesforce payload:", payload)

  const res = await axios.post(
    `${MCP}/salesforce/account`,
    payload
  )

  return res.data
}

async function getAccountDetails(name) {

  const res = await axios.get(
    `${MCP}/salesforce/account/${encodeURIComponent(name)}`
  )

  return res.data
}

async function updateAccount(name, fields) {

  const account = await getAccountByName(name)

  if (!account) {
    return { error: "Account not found" }
  }

  const res = await axios.patch(
    `${MCP}/salesforce/account/${account.Id}`,
    fields
  )

  return res.data
}
/*
Update Salesforce account
*/
async function updateAccount(accountId, fields) {

  console.log("✏️ Updating account:", accountId)

  const res = await axios.patch(
    `${MCP}/salesforce/account/${accountId}`,
    fields
  )

  return res.data
}


/*
Get Databricks orders
*/
async function getOrders(accountId) {

  console.log("📦 Fetching orders for:", accountId)

  const res = await axios.get(
    `${MCP}/databricks/orders/${accountId}`
  )

  return res.data
}


/*
Full profile (Salesforce + Databricks)
*/
async function getFullAccountProfile(accountName) {

  console.log("📊 Fetching profile for:", accountName)

  const account = await getAccountByName(accountName)

  if (!account) {
    return { error: "Account not found" }
  }

  const orders = await getOrders(account.Id)

  return {
    account,
    orders
  }
}

module.exports = {
  getAccountByName,
  createAccount,
  getOrders,
  getFullAccountProfile,
  getAccountDetails,
  updateAccount,
  getAllAccounts
}