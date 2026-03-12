const sf = require("../integrations/salesforceClient")
const db = require("../integrations/databricksClient")

async function fullAccountProfile(name){

const account = await sf.getAccountByName(name)

if(!account) return null

const orders = await db.getOrders(account.Id)

return {
account,
orders
}

}

module.exports = {
fullAccountProfile
}