import LocalSession = require('telegraf-session-local');

export const sessionMiddleware = () => {
  // const connectionObject = parseUrlConnect(connectUrl);
  // const store: SessionStore<object> = Postgres({ ...connectionObject, table: '_tg_sessions' });
  const store = new LocalSession();
  return store.middleware();
};

// export const sessionMiddleware = session;
