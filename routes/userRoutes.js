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

router.get('/checkout', async (req, res) => {
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
        ]
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