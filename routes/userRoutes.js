import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, getAvailTicketSearch } from "../db.js";
import express from 'express';
import {db} from "../index.js";

const router = express.Router();

router.get('/', async (req, res) => {
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

router.post('/checkout', async (req, res) => {
    const salesSummary = new TicketSalesSummary(db, req.body.ticket)
    await salesSummary.init()
    if (parseInt(salesSummary.getTotalSoldTickets()) + parseInt(req.body.regular) + parseInt(req.body.children) + parseInt(req.body.student) > salesSummary.getMaxTickets()) {res.sendStatus(500); return;}
    const category = await salesSummary.getCategory();
    await category.init()
    res.render("checkout", {
        stylesheets: [
            "/css/style.css",
            "/css/checkout.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/checkout.js"
        ],
        data: req.body,
        times: {
            start: salesSummary.getStartTime(),
            end: salesSummary.getEndTime()
        },
        total: category.getRegularPrice()*parseInt(req.body.regular)+category.getChildrenPrice()*parseInt(req.body.children)+category.getStudentPrice()*parseInt(req.body.student)+category.getAudioguidePrice()*req.body.audioguide
    });
});

router.post('/buy', async (req, res) => {
    const people = await Person.searchByEmail(db, req.body.email)
    let person = null;
    people.forEach(p => {
        if (p.getFirstName() === req.body.name && p.getLastName() === req.body.surname) {
            person = p;
        }
    })
    if (!person) {
        let email = null;
        try {
            email = await new Email(db, req.body.email);
            await email.init()
        } catch (err) {
            email = await Email.create(db, req.body.email);
            await email.init()
        }
        person = await Person.create(
            db, req.body.name, req.body.surname, req.body.phone, email
        )
        await person.init()
    }
    const availableTickets = new AvailableTickets(db, req.body.ticket);
    await availableTickets.init()
    const category = await availableTickets.getCategory();
    await category.init()
    const sale = await TicketSales.create(
        db,
        req.body.regular,
        req.body.children,
        req.body.student,
        req.body.audioguide,
        (req.body.amea === 'on'),
        category.getRegularPrice()*parseInt(req.body.regular)+category.getChildrenPrice()*parseInt(req.body.children)+category.getStudentPrice()*parseInt(req.body.student)+category.getAudioguidePrice()*req.body.audioguide,
        person,
        availableTickets
    )
    await sale.init()
    res.sendStatus(204)
})

router.get('/buy', async (req, res) => {
    res.render("buy", {
        stylesheets: [
            "/css/style.css",
            "/css/checkout.css",
            "/css/buy.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/checkout.js"
        ],
    });
});

router.get('/gallery', async (req, res) => {
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

router.get('/about', async (req, res) => {
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

router.get('/contact', async (req, res) => {
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

router.get('/tickets', async (req, res) => {
    const categories = await TicketsCategory.getAllWithAvail(db)
    let data = categories.map(cat => ({
        'name': cat.name,
        "id": cat.id
    }))
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
        ],
        data: data
    });
});

export default router;