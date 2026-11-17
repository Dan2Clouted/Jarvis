require("dotenv").config();
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const client = new Anthropic();

app.use(express.json());
app.use(express.static("public")); // serves your web page

const JARVIS_PERSONALITY = `
You are Jarvis, a personal AI assistant for Daniel.
You are calm, confident and a little witty, like a loyal butler.
Keep answers short: 1 to 3 sentences, unless Daniel asks for more detail.
Your answers will be spoken out loud, so never use markdown,
bullet points, asterisks or emojis. Write in plain, natural speech.
`;

app.post("/chat", async (req, res) => {
  const history = req.body.messages;

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 300,
    system: JARVIS_PERSONALITY,
    messages: history,
  });

  console.log(response);
  const textBlock = response.content.find((block) => block.type === "text");
  res.json({ answer: textBlock.text });
});

app.listen(3000, () => {
  console.log("Jarvis is online at http://localhost:3000");
});
