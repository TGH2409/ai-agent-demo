require("dotenv").config()
const { HfInference } = require("@huggingface/inference")

const hf = new HfInference(process.env.HF_API_KEY)

async function askLLM(prompt) {

  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [
      { role: "user", content: prompt }
    ],
    max_tokens: 200,
    temperature: 0.2
  })

  return response.choices[0].message.content
}

module.exports = askLLM