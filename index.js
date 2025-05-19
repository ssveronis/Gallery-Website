import express, {raw} from 'express';
import { create } from 'express-handlebars';
import 'dotenv/config'
import device from 'express-device';
import {getNav} from "./helpers.js";
import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, getAvailTicketSearch } from "./db.js";
import bodyParser from "body-parser";
import fs from 'fs';
import path from 'path';

const db = new DB();
const app = express();
const port = process.env.PORT;
const hbs = create({ extname: '.hbs',
    helpers: {
        getNav: getNav,
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.locals.device = device.capture(req);
    res.locals.path = req.path;
    next();
});

import userRoutes from './routes/userRoutes.js';
app.use(userRoutes); 

import userApiRoutes from  "./routes/apiUser.js";
app.use(userApiRoutes);

import adminRoutes from "./routes/adminRoutes.js";
app.use(adminRoutes);

import adminApiRoutes from "./routes/apiAdmin.js";
app.use(adminApiRoutes);

export default app;
export { db };