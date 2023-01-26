require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");

// Set the API key for OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Replace YOUR_BOT_TOKEN with your bot's token
const bot = new TelegramBot(process.env.TELEGRAM_BOT, {
  polling: true,
});

// Set the chat ID for the ChatGPT chat
const chatId = "1686261241";

// Handle incoming messages
bot.on("message", async (msg) => {
  const openai = new OpenAIApi(configuration);
  await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: msg.text,
      temperature: 0.6,
      max_tokens: 4000,
    })
    .then((response) => {
      // Send the response back to the user
      console.log(response.data.choices);
      bot.sendMessage(chatId, response.data.choices[0].text);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Start the bot
bot.on("polling_error", (error) => {
  console.log(error);
});
