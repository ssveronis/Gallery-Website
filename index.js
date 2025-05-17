import express, {raw} from 'express';
import { create } from 'express-handlebars';
import 'dotenv/config'
import device from 'express-device';
import {getNav} from "./helpers.js";
import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary } from "./db.js";
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
            "displayName": user.getDisplayName(),
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
                "id": sum.getId(),
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
        "accessibility": sale.getAccessibility(),
        "total": sale.getTotal()
    }
    res.send(data)
});

app.post('/api/newTicketsCategory', async (req, res) => {
    if (req.body.categoryId) {
        const category = new TicketsCategory(db, req.body.categoryId);
        await category.init()
        if (req.body.categoryName != category.getName()) category.updateName(req.body.categoryName)
        if (req.body.normalPrice != category.getRegularPrice()) category.updateRegularPrice(req.body.normalPrice)
        if (req.body.childrenPrice != category.getChildrenPrice()) category.updateChildrenPrice(req.body.childrenPrice)
        if (req.body.studentPrice != category.getStudentPrice()) category.updateStudentPrice(req.body.studentPrice)
        if (req.body.audioguidePrice != category.getAudioguidePrice()) category.updateAudioguidePrice(req.body.audioguidePrice)
        const amea = (req.body.accessAmea!=null)?1:0
        if (amea != category.getName()) category.updateCanAccAMEA(amea)
    } else {
        TicketsCategory.create(
            db,
            req.body.categoryName,
            req.body.normalPrice,
            req.body.childrenPrice,
            req.body.studentPrice,
            req.body.audioguidePrice,
            ((req.body.accessAmea!=null)?1:0),
        )
    }
    res.redirect(303,'/wp-admin/tickets')
})

app.get('/api/ticketCategory/:id', async (req, res) => {
    const category = new TicketsCategory(db, req.params.id)
    await category.init()
    let data = {
        "id": category.getId(),
        "name": category.getName(),
        "regularPrice": category.getRegularPrice(),
        "childrenPrice": category.getChildrenPrice(),
        "studentPrice": category.getStudentPrice(),
        "audioguidePrice": category.getAudioguidePrice(),
        "canAccAMEA": category.getCanAccAMEA()
    }
    res.send(data)
})

app.post('/api/newTicketAvailability', async (req, res) => {
    const category = new TicketsCategory(db, req.body.newTicketAvailId);
    await category.init()
    const availability = AvailableTickets.create(
        db,
        req.body.date,
        req.body.startTime,
        req.body.endTime,
        req.body.total,
        category
    )
    res.redirect(303,'/wp-admin/tickets')
})

app.post('/api/editTicketAvailability', async (req, res) => {
    const availability = new AvailableTickets(db, req.body.editTicketAvailId);
    await availability.init()
    availability.updateMaxTickets(req.body.total);
    res.redirect(303,'/wp-admin/tickets')
})

app.delete('/api/deleteTicketAvailability/:id', async (req, res) => {
    const availability = new AvailableTickets(db, req.params.id);
    await availability.init()
    availability.delete()
    res.sendStatus(204)
})

app.post('/api/newUser', async (req, res) => {
    let email = new Email(db, req.body.userEmail);
    try {
        await email.init()
    } catch (e) {
        email = await Email.create(
            db,
            req.body.userEmail
        )
        await email.init()
    }
    const user = WP_User.create(
        db,
        req.body.username,
        '0',
        req.body.displayName,
        email
    )
    res.redirect(303,'/wp-admin/user-list')
})

app.get('/api/getUser/:id', async (req, res) => {
    const user = new WP_User(
        db,
        req.params.id
    )
    await user.init()
    const data = {
        "id": user.getId(),
        "displayName": user.getDisplayName(),
        "email": user.getEmail().getEmail(),
    }
    res.send(data);
})

app.post('/api/editUser', async (req, res) => {
    const user = new WP_User(
        db,
        req.body.userId,
    )
    await user.init()
    user.updateDisplayName(req.body.displayName)
    user.getEmail().updateEmail(req.body.userEmail)
    res.redirect(303,'/wp-admin/user-list')
})

app.delete('/api/deleteUser/:id', async (req, res) => {
    const user = new WP_User(
        db,
        req.params.id
    )
    await user.init()
    await user.delete()
    res.sendStatus(204)
})

app.post('/api/registerNewsletter', async (req, res) => {
    let email = new Email(db, req.body.email);
    try {
        await email.init()
        await email.updateNewsletter(true)
    } catch (e) {
        email = await Email.create(db, req.body.email, true)
        await email.init()
    }
    res.redirect(303,req.body.path)
})

export default app;