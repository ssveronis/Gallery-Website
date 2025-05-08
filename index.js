import express from 'express';
import { create } from 'express-handlebars';
import 'dotenv/config'
import device from 'express-device';
import {getNav} from "./helpers.js";
import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary } from "./db.js";
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

app.use((req, res, next) => {
    res.locals.device = device.capture(req);
    res.locals.path = req.path;
    next();
});

app.get('/', async (req, res) => {
    res.render("root", {
        stylesheets: [
            "/css/style.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js"
        ]
    });
});

app.get('/gallery', async (req, res) => {
    res.render("gallery", {
        stylesheets: [
            "/css/style.css",
            "/css/gallery.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/gallery.js"
        ]
    });
});

app.get('/about', async (req, res) => {
    res.render("about", {
        stylesheets: [
            "/css/style.css",
            "/css/about_style.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
        ]
    });
});

app.get('/contact', async (req, res) => {
    res.render("contact", {
        stylesheets: [
            "/css/style.css",
            "/css/contact.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
        ]
    });
});

app.get('/tickets', async (req, res) => {
    res.render("tickets", {
        stylesheets: [
            "/css/style.css",
            "/css/tickets_style.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/tickets.js",
            "/js/mobile_script.js",
            "/js/tickets.js"
        ]
    });
});

app.get('/wp-admin', async (req, res) => {
    res.render("login", {
        stylesheets: [
            "/css/style.css",
            "/css/login_style.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
        ]
    });
});

app.get('/wp-admin/user-list', async (req, res) => {
    const users = await WP_User.getAll(db)
    let data = []

    for (const user of users) {
        let partData = {
            "id": user.getId(),
            "nicename": user.getDisplayName(),
            "login": user.getLogin(),
            "email": user.getEmail().getEmail()
        }
        data.push(partData)
    }

    res.render("userList", {
        stylesheets: [
            "/css/style.css",
            "/css/adminStyles.css",
            "/css/userList_styles.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        ],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/userList.js"
        ],
        data: data
    });
});

app.get('/wp-admin/tickets', async (req, res) => {

    let data = []

    const categories = await TicketsCategory.getAll(db)
    for (const cat of categories) {
        const summaries = await TicketSalesSummary.getAll(db, cat.getId())

        var partData = {
            "name": cat.getName(),
            "id": cat.getId(),
            "availabilities": []
        }

        for (const sum of summaries) {
            partData["availabilities"].push({
                "date": (new Date(sum.getDate())).toLocaleDateString(),
                "start_time": sum.getStartTime(),
                "end_time": sum.getEndTime(),
                "max_tickets": sum.getMaxTickets(),
                "sold_tickets": sum.getTotalSoldTickets(),
                "available_tickets":  sum.getAvailableTickets()
            })
        }

        data.push(partData)
    }

    res.render("ticketsCategory", {
        stylesheets: [
            "/css/style.css",
            "/css/adminStyles.css",
            "/css/ticketsCategory.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        ],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/ticketsCategory.js"
        ],
        data: data
    });
});

app.get('/wp-admin/sales', async (req, res) => {
    const sales = await TicketSales.getAll(db)
    let data = []

    for (const sale of sales) {
        let partData = {
            "id": sale.getId(),
            "date": (new Date(sale.getDate())).toLocaleDateString(),
            "toatl_tickets": sale.getRegularTickets() + sale.getChildrenTickets() + sale.getStudentTickets(),
            "regular_tickets": sale.getRegularTickets(),
            "children_tickets": sale.getChildrenTickets(),
            "student_tickets": sale.getStudentTickets(),
            "name": sale.getPerson().getFirstName() + " " + sale.getPerson().getLastName(),
            "email": sale.getPerson().getEmail().getEmail(),
        }
        data.push(partData)
    }

    res.render("ticketSales", {
        stylesheets: [
            "/css/style.css",
            "/css/adminStyles.css",
            "/css/ticketSales.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        ],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/ticketSales.js"
        ],
        data: data
    });
});

app.get('/api/sale/:id', async (req, res) => {
    const sale = new TicketSales(db, req.params.id)
    await sale.init()
    let data = {
        "id": sale.getId(),
        "date": (new Date(sale.getDate())).toLocaleDateString(),
        "toatl_tickets": sale.getRegularTickets() + sale.getChildrenTickets() + sale.getStudentTickets(),
        "regular_tickets": sale.getRegularTickets(),
        "children_tickets": sale.getChildrenTickets(),
        "student_tickets": sale.getStudentTickets(),
        "name": sale.getPerson().getFirstName() + " " + sale.getPerson().getLastName(),
        "email": sale.getPerson().getEmail().getEmail(),
        "total": sale.getTotal()
    }
    res.send(data)
});

export default app;