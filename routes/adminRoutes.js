import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, getAvailTicketSearch } from "../db.js";
import express from 'express';
import {db} from "../index.js";

const router = express.Router();

router.get('/admin', async (req, res) => {
    res.locals.title = "Admin";
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
            "/js/login.js"
        ],
        error: req.flash('error'),
        success: req.flash('success'),
    });
});

router.get('/admin/user-list', async (req, res) => {
    res.locals.title = "Users";
    const users = await WP_User.getAll(db)
    let data = []

    for (const user of users) {
        let partData = {
            "id": user.getId(),
            "displayName": user.getDisplayName(),
            "login": user.getLogin(),
            "email": user.getEmail().getEmail(),
            "displayDelete": (user.getId() !== req.session.loggedUserId)
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
            
            "/js/mobile_script.js",
            "/js/userList.js"
        ],
        data: data,
        error: req.flash('error')
    });
});

router.get('/admin/tickets', async (req, res) => {
    res.locals.title = "Tickets";
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
            
            "/js/mobile_script.js",
            "/js/ticketsCategory.js"
        ],
        data: data,
        error: req.flash("error")
    });
});

router.get('/admin/sales', async (req, res) => {
    res.locals.title = "Sales";
    const categories = await TicketsCategory.getAll(db);
    let catData = []

    for (const cat of categories) {
        var partData = {
            "name": cat.getName(),
            "id": cat.getId(),
            "availabilities": []
        }
        catData.push(partData)
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
            
            "/js/mobile_script.js",
            "/js/ticketSales.js"
        ],
        categories: catData
    });
});

router.get('/admin/emails', async (req, res) => {
    const emails = await Email.getAll(db)
    let data = emails.map(email => email.getNewsletter()?email.getEmail():null)
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="emails.csv"');
    res.write('Email Address\r\n')
    data.forEach(email => {
        if (email != null) res.write(email + '\r\n')
    })
    res.end()
})

router.get('/logout', async (req, res) => {
    req.session.loggedUserId = null;
    res.redirect(303, '/')
})

export default router;