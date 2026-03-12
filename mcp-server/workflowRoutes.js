const express = require("express")
const router = express.Router()

const wf = require("../workflows/workflows")

router.get("/profile/:name",async(req,res)=>{

const result = await wf.fullAccountProfile(req.params.name)

res.json(result)

})

module.exports = router