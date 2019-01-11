'use strict';

const TelegramBot = require('node-telegram-bot-api');
const vm = require('vm');

const token = '700792770:AAHsyUZ-1vhIjdgW6RY7NMIg3WMQLkluIck';

const bot = new TelegramBot(token, { polling: true });

async function compile(code) {
  const sandbox = {
    console: {
      log(...a) {
        sandbox.__res__.push(...a);
      },
      dir(...a) {
        sandbox.__res__.push(...a);
      },
      info(...a) {
        sandbox.__res__.push(...a);
      },
      error(a) {
        sandbox.__res__.push(...a);
      },
    },
    __res__: []
  };

  const context = vm.createContext(sandbox);
  try {
    const script = new vm.Script(code);
    script.runInContext(context);
  } catch (error) {
    sandbox.__res__.push('Сэр, ваше дерьмо не работает!');
    sandbox.__res__.push(error.toString());
  }
  return sandbox.__res__;
}

bot.onText(/node (.+)/, (msg, match) => {
  const fromId = msg.chat.id;
  setImmediate(()=>{
  bot.sendMessage(fromId, 'Гавнокод компилируется...');
  });
  const code = match[1];
  setImmediate(()=>{
   bot.sendMessage(fromId, 'test');
  });
  (async ()=> {
  const res = await compile(code);
  for (const value of res) {
   setImmediate(()=>{
    bot.sendMessage(fromId, value);
   }) 
  }
  })();
  
});

