import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, getAvailTicketSearch } from "../db.js";
import express from 'express';
import {db} from "../index.js";
import crypto from "crypto";
import {sendMailRegister} from "../controller/mailer.js";

const router = express.Router();

router.get('/api/sales/', async (req, res) => {
    const sales = await TicketSales.getAll(db)
    let data = []
    for (const sale of sales) {
        let partData = {
            "id": sale.getId(),
            "date": (new Date(sale.getAvailableTickets().getDate())).toLocaleDateString(),
            "start_time": sale.getAvailableTickets().getStartTime(),
            "end_time": sale.getAvailableTickets().getEndTime(),
            "category": sale.getAvailableTickets().getCategory().getName(),
            "total_tickets": sale.getRegularTickets() + sale.getChildrenTickets() + sale.getStudentTickets(),
            "regular_tickets": sale.getRegularTickets(),
            "children_tickets": sale.getChildrenTickets(),
            "student_tickets": sale.getStudentTickets(),
            "name": sale.getPerson().getFirstName() + " " + sale.getPerson().getLastName(),
            "email": sale.getPerson().getEmail().getEmail(),
        }
        data.push(partData)
    }
    res.send(data)
})

router.get('/api/sale/:id', async (req, res) => {
    const sale = new TicketSales(db, req.params.id)
    await sale.init()
    const salesSummary = new TicketSalesSummary(db, sale.getAvailableTickets().getId())
    await salesSummary.init()
    let data = {
        "id": sale.getId(),
        "buy_date": (new Date(sale.getDate())).toLocaleDateString(),
        "toatl_tickets": sale.getRegularTickets() + sale.getChildrenTickets() + sale.getStudentTickets(),
        "regular_tickets": sale.getRegularTickets(),
        "children_tickets": sale.getChildrenTickets(),
        "student_tickets": sale.getStudentTickets(),
        "audioguides": sale.getAudioguides(),
        "name": sale.getPerson().getFirstName() + " " + sale.getPerson().getLastName(),
        "email": sale.getPerson().getEmail().getEmail(),
        "accessibility": sale.getAccessibility(),
        "total": sale.getTotal(),
        "category": sale.getAvailableTickets().getCategory().getName(),
        "time": `${sale.getAvailableTickets().getStartTime()} - ${sale.getAvailableTickets().getEndTime()}`,
        "date": (new Date(sale.getAvailableTickets().getDate())).toLocaleDateString(),
        "max_tickets": sale.getAvailableTickets().getMaxTickets(),
        "available_tickets": salesSummary.getAvailableTickets(),
        "sold_tickets": salesSummary.getTotalSoldTickets()
    }
    res.send(data)
});

router.post('/api/newTicketsCategory', async (req, res) => {
    if (req.body.newCategoryId) {
        const category = new TicketsCategory(db, req.body.newCategoryId);
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
    res.redirect(303,'/admin/tickets')
})

router.get('/api/ticketCategory/:id', async (req, res) => {
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

router.post('/api/newTicketAvailability', async (req, res) => {
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
    res.redirect(303,'/admin/tickets')
})

router.post('/api/editTicketAvailability', async (req, res) => {
    const availability = new AvailableTickets(db, req.body.editTicketAvailId);
    await availability.init()
    const salesSum = new TicketSalesSummary(db, req.body.editTicketAvailId);
    await salesSum.init()
    if (salesSum.getTotalSoldTickets() <= req.body.total) availability.updateMaxTickets(req.body.total); else req.flash("error", "Μη αποδεκτή τιμή")
    res.redirect(303,'/admin/tickets')
})

router.delete('/api/deleteTicketAvailability/:id', async (req, res) => {
    const availability = new AvailableTickets(db, req.params.id);
    await availability.init()
    availability.delete()
    res.sendStatus(204)
})

router.post('/api/newUser', async (req, res) => {
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
    const user = await WP_User.create(
        db,
        req.body.username,
        crypto.randomBytes(100).toString('hex').slice(0, 100),
        req.body.displayName,
        email
    )
    await user.init()
    await sendMailRegister(process.env.DOMAIN, user.getEmail().getEmail())
    res.redirect(303,'/admin/user-list')
})

router.get('/api/getUser/:id', async (req, res) => {
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

router.post('/api/editUser', async (req, res) => {
    const user = new WP_User(
        db,
        req.body.userId,
    )
    await user.init()
    user.updateDisplayName(req.body.displayName)
    user.getEmail().updateEmail(req.body.userEmail)
    res.redirect(303,'/admin/user-list')
})

router.delete('/api/deleteUser/:id', async (req, res) => {
    const user = new WP_User(
        db,
        req.params.id
    )
    await user.init()
    await user.delete()
    res.sendStatus(204)
})

export default router;