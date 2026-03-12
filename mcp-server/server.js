require("dotenv").config()
const express = require("express")
const cors = require("cors")

const salesforceRoutes = require("./salesforceRoutes")
const databricksRoutes = require("./databricksRoutes")
const workflowRoutes = require("./workflowRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/salesforce", salesforceRoutes)
app.use("/databricks", databricksRoutes)
app.use("/workflow", workflowRoutes)

app.get("/health",(req,res)=>{
res.json({
status:"ok",
salesforce:"connected",
databricks:"connected"
})
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`)
})