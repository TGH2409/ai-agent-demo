require("dotenv").config()
const jsforce = require("jsforce")

async function test() {

  const conn = new jsforce.Connection({
    loginUrl: "https://login.salesforce.com"
  })

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
  )

  console.log("✅ Connected to Salesforce")

  const result = await conn.query(
    "SELECT Id, Name FROM Account LIMIT 5"
  )

  console.log(result.records)
}

test()