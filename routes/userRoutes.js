import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, PasswdForgotTokens, getAvailTicketSearch } from "../db.js";
import express from 'express';
import {db} from "../index.js";
import crypto from "crypto";
import {sendMailBuy, sendMailResetPasswd} from "../controller/mailer.js";

const router = express.Router();

router.get('/', async (req, res) => {
    res.locals.title = "Αρχική";
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
    res.locals.title = "Ευχαριστούμε!";
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
    await sendMailBuy(process.env.DOMAIN, sale)
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
})

router.get('/gallery', async (req, res) => {
    res.locals.title = "Έκθεση";
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
    res.locals.title = "Σχετικά";
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
    res.locals.title = "Επικοινωνία";
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
    res.locals.title = "Εισιτήρια";
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

router.get('/password-reset', async (req, res) => {
    res.locals.title = "Αλλαγή Κωδικού";
    res.render("passwordReset", {
        stylesheets: [
            "/css/style.css",
            "/css/login_style.css",
            "/css/passwordReset.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/login.js"
        ]
    });
});

router.post('/password-reset', async (req, res) => {
    let user = null;
    const userByLogin = await WP_User.searchByLogin(db, req.body.identifier)
    if (userByLogin.length !== 1) {
        const userByEmail = await WP_User.searchByEmail(db, req.body.identifier)
        if(userByEmail.length !== 1) {
            res.redirect(303, '/admin')
            return
        }
        user = userByEmail[0]
    }
    user = userByLogin[0]
    await user.init()
    const token = crypto.randomBytes(100).toString('hex').slice(0, 100);
    await PasswdForgotTokens.create(db, token, user)
    await sendMailResetPasswd(`${process.env.DOMAIN}:${process.env.PORT}`, user.getEmail().getEmail(), token)
    res.redirect(303, '/admin')
})

router.get('/password-reset/:token', async (req, res) => {
    const token = req.params.token
    const tokenObj = await new PasswdForgotTokens(db, token)
    try {
        await tokenObj.init()
        if (Date.now()-Date.parse(tokenObj.getTimestamp())>300000+3*60*60*1000) throw new Error();
    } catch (err) {
        res.redirect(303, '/admin')
        return
    }
    res.render("newPasswd", {
        stylesheets: [
            "/css/style.css",
            "/css/login_style.css",
            "/css/passwordReset.css",
            "https://unpkg.com/aos@2.3.4/dist/aos.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"],
        scripts: [
            "/js/script.js",
            "/js/mobile_script.js",
            "/js/login.js"
        ],
        token: tokenObj.getToken(),
    })
})

router.post('/newPassword', async (req, res) => {
    const token = req.body.token
    const tokenObj = await new PasswdForgotTokens(db, token)
    try {
        await tokenObj.init()
        if (Date.now()-Date.parse(tokenObj.getTimestamp())>300000+3*60*60*1000) throw new Error();
    } catch (err) {
        res.redirect(303, '/admin')
        return
    }
    const user = await tokenObj.getUser()
    if(req.body["new_password"] === req.body["new_password_repeat"])
    await user.updatePassword(req.body.new_password)
    await tokenObj.delete()
    res.redirect(303, '/admin')
})

router.post('/login', async (req, res) => {
    res.locals.title = "Σύνδεση";
    const user = new WP_User(db, req.body.username)
    try {
        await user.init()
        if (await user.isPasswdValid(req.body.passwd)) {
            req.session.loggedUserId = user.getId();
        } else throw new Error();
    } catch (err) {
        res.redirect('/admin')
        return
    }
    res.redirect('/admin/sales')
})

export default router;