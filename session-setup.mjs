import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config();


const sessionConf = {
   secret: 'έναμεγάλοτυχαίοαλφαριθμητικό',
   cookie: { maxAge: 120000 }, 
   resave: false,
   saveUninitialized: false,
};

const sessionMiddleware = session(sessionConf); 

export default sessionMiddleware;