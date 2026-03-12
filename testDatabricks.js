require("dotenv").config()
const { DBSQLClient } = require("@databricks/sql")

async function test() {

  const client = new DBSQLClient()

  await client.connect({
    host: process.env.DATABRICKS_SERVER_HOSTNAME,
    path: process.env.DATABRICKS_HTTP_PATH,
    token: process.env.DATABRICKS_ACCESS_TOKEN
  })

  console.log("✅ Connected to Databricks")

  const session = await client.openSession()

  const query = "SELECT * FROM workspace.default.orders LIMIT 5"

  const operation = await session.executeStatement(query)

  const result = await operation.fetchAll()

  console.log("Orders:")
  console.log(result)

}

test()