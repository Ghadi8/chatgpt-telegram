require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");

// Set the API key for OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const history = [];

// Replace YOUR_BOT_TOKEN with your bot's token
const bot = new TelegramBot(process.env.TELEGRAM_BOT, {
  polling: true,
});

// Set the chat ID for the ChatGPT chat
const chatId = process.env.TELEGRAM_CHAT_ID;

// Handle incoming messages
bot.on("message", async (msg) => {
  const user_input = msg.text;

  const messages = [];

  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: user_input });

  await openai
    .createChatCompletion({
      model: "gpt-4",
      messages: messages,
    })
    .then((response) => {
      // Send the response back to the user
      bot.sendMessage(chatId, response.data.choices[0].message.content);
      history.push([user_input, response.data.choices[0].message.content]);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Start the bot
bot.on("polling_error", (error) => {
  console.log(error);
});
