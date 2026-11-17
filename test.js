require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline/promises");

const client = new Anthropic();

const JARVIS_PERSONALITY = `
  You are Jarvis, a personal AI assistant for Daniel.
  You are calm, confident and a little witty, like a loyal butler.
  Keep answers short: 1 to 3 sentences, unless Daniel asks for more detail.
  Your answers will be spoken out loud, so never use markdown,
  bullet points, asterisks or emojis. Write in plain, natural speech.
  `;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askJarvis() {
  const history = []; // NEW: the conversation lives here

  while (true) {
    const question = await rl.question("You: ");

    if (question.toLowerCase() === "bye") {
      break;
    }

    history.push({ role: "user", content: question }); // NEW

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 300,
      messages: history, // NEW: send the whole conversation
      system: JARVIS_PERSONALITY,
    });

    const answer = response.content[0].text;
    console.log("Jarvis:", answer);

    history.push({ role: "assistant", content: answer }); // NEW
  }

  rl.close();
}

askJarvis();
