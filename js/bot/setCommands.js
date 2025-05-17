export const setBotCommands = (bot) => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Запуск бота, отримання початкової інформації",
    },
    { command: "/help", description: "Що робить цей бот" },
    { command: "/info", description: "Як користуватись монетками" },
  ]);
};
