require("dotenv").config()
const jsforce = require("jsforce")


async function getConnection(){

const conn = new jsforce.Connection({
loginUrl:"https://login.salesforce.com"
})

await conn.login(
process.env.SF_USERNAME,
process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
)

return conn

}

/*
GET ACCOUNT BY NAME
*/

async function getAccountByName(name){

const conn = await getConnection()

const result = await conn.query(`
SELECT Id, Name, Industry, BillingCity, Phone
FROM Account
WHERE Name LIKE '%${name}%'
LIMIT 1
`)

return result.records[0]

}


/*
GET ALL ACCOUNTS
*/

async function getAllAccounts(){

const conn = await getConnection()

const result = await conn.query(`
SELECT Id, Name, Industry, BillingCity, Phone
FROM Account
ORDER BY Name
LIMIT 100
`)

return result.records

}


/*
CREATE ACCOUNT
*/

async function createAccount(data){

const conn = await getConnection()

const result = await conn.sobject("Account").create(data)

return result

}


/*
EXPORT FUNCTIONS
*/

module.exports = {
getAccountByName,
getAllAccounts,
createAccount
}