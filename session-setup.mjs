import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config();

const knex = require('knex')({
   client: 'mysql2',
   connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
   }
});

const store = new KnexSessionStore({
   knex,
   tablename: 'sessions', // Optional. Defaults to 'sessions'
   sidfieldname: 'sid',
   createtable: true,     // Creates table automatically if not exists
   clearInterval: 600000  // Milliseconds to check and clear expired sessions
});

const sessionConf = {
   secret: 'bUSbM8vWeu5aZTQfrcsP2PZYuRQgJ7RsdjFZmRXMpffwwm39Hz36YGZ2Zse5pysY',
   store: store,
   cookie: { maxAge: 1000 * 60 * 60 * 24 },
   resave: false,
   saveUninitialized: false,
};

const sessionMiddleware = session(sessionConf); 

export default sessionMiddleware;