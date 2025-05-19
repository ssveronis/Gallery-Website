import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, getAvailTicketSearch } from "../db.js";
import express from 'express';
import {db} from "../index.js";

const router = express.Router();

router.post('/api/registerNewsletter', async (req, res) => {
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

router.post('/api/tickets', async (req, res) => {
    res.send(await getAvailTicketSearch(
        db,
        req.body.categoryId,
        req.body.date,
        parseInt(req.body.regular),
        parseInt(req.body.children),
        parseInt(req.body.student),
        parseInt(req.body.audioguide)
    ))
})

export default router;