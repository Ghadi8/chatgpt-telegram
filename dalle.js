require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");

// Set the API key for OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Replace YOUR_BOT_TOKEN with your bot's token
const bot = new TelegramBot(process.env.DALLE_TELEGRAM_BOT, {
  polling: true,
});

// Set the chat ID for the ChatGPT chat
const chatId = process.env.DALLE_TELEGRAM_CHAT_ID;

// Handle incoming messages
bot.on("message", async (msg) => {
  const user_input = msg.text;

  await openai
    .createImage({
      prompt: user_input,
      n: 1,
      size: "1024x1024",
    })
    .then((response) => {
      image_url = response.data.data[0].url;
      bot.sendMessage(chatId, image_url);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Start the bot
bot.on("polling_error", (error) => {
  console.log(error);
});
