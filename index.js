const telegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const bot = new telegramBot(process.env.TELEGRAM_TOKEN);
if (process.env.NODE_ENV === 'production') {
  bot.setWebHook(process.env.HEROKU_URL + bot.token)
} else {
  bot.startPolling();
}

//for webhooks
const app = express();
app.use(bodyParser.json());
app.listen(process.env.PORT);
app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hello World!");
})

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is what the bot receives that matches with the the regexp
  // 'match' is the result of executing the regexp above on the message
  const chatId = msg.chat.id;
  const resp = match[1]; // everything after echo
  bot.sendMessage(chatId, resp); //sending response back
});
