import LocalSession = require('telegraf-session-local');

export const sessionMiddleware = () => {
  const store = new LocalSession();
  return store.middleware();
};

// export const sessionMiddleware = session;
