require("dotenv").config()
const { DBSQLClient } = require("@databricks/sql")

async function getOrders(accountId) {

  const client = new DBSQLClient()

  await client.connect({
    host: process.env.DATABRICKS_SERVER_HOSTNAME,
    path: process.env.DATABRICKS_HTTP_PATH,
    token: process.env.DATABRICKS_ACCESS_TOKEN
  })

  const session = await client.openSession()

  const query = `
    SELECT *
    FROM workspace.default.orders
    WHERE account_id = :accountId
  `

  const operation = await session.executeStatement(query, {
    namedParameters: {
      accountId: accountId
    }
  })

  const result = await operation.fetchAll()

  


  await operation.close()

  return result
}

module.exports = { getOrders }