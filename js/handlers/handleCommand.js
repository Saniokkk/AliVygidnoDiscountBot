export const handleCommand = (text, chatId, bot, HTMLOptions) => {
  if (text === "/start") {
    return bot.sendMessage(chatId, startMessage, HTMLOptions);
  }
  if (text === "/info") {
    return bot.sendMessage(chatId, messageForHelp, HTMLOptions);
  }
  if (text === "/help") {
    return bot.sendMessage(chatId, messageForInfo, HTMLOptions);
  }
};
