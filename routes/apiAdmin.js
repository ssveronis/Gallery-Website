import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, getAvailTicketSearch } from "../db.js";
import express from 'express';
import { db } from "../index.js";
import crypto from "crypto";

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
    let sale;
    let salesSummary;
    try {
        sale = new TicketSales(db, req.params.id)
        await sale.init()
        salesSummary = new TicketSalesSummary(db, sale.getAvailableTickets().getId())
        await salesSummary.init()
    } catch (e) {
        res.redirect("/logout")
        return
    }
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
        const amea = (req.body.accessAmea != null) ? 1 : 0
        if (amea != category.getName()) category.updateCanAccAMEA(amea)
    } else {
        TicketsCategory.create(
            db,
            req.body.categoryName,
            req.body.normalPrice,
            req.body.childrenPrice,
            req.body.studentPrice,
            req.body.audioguidePrice,
            ((req.body.accessAmea != null) ? 1 : 0),
        )
    }
    res.redirect(303, '/admin/tickets')
})

router.get('/api/ticketCategory/:id', async (req, res) => {
    let category;
    try {
        category = new TicketsCategory(db, req.params.id)
        await category.init()
    } catch (e) {
        res.redirect("/logout")
        return
    }
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
    let category
    try {
        category = new TicketsCategory(db, req.body.newTicketAvailId);
        await category.init()
        let today = new Date().toISOString().split('T')[0]
        if (!(req.body.date >= today) || !(req.body.endTime > req.body.startTime)) throw new Error()
        const availability = await AvailableTickets.create(
            db,
            req.body.date,
            req.body.startTime,
            req.body.endTime,
            req.body.total,
            category
        )
    } catch (e) {
        console.log(e)
        res.redirect("/logout")
        return
    }
    res.redirect(303, '/admin/tickets')
})

router.post('/api/editTicketAvailability', async (req, res) => {
    let availability
    let salesSum
    try {
        availability = new AvailableTickets(db, req.body.editTicketAvailId);
        await availability.init()
        salesSum = new TicketSalesSummary(db, req.body.editTicketAvailId);
        await salesSum.init()
    } catch (e) {
        res.redirect("/logout")
        return
    }
    if (salesSum.getTotalSoldTickets() <= req.body.total) availability.updateMaxTickets(req.body.total); else req.flash("error", "Μη αποδεκτή τιμή")
    res.redirect(303, '/admin/tickets')
})

router.delete('/api/deleteTicketsCategory/:id', async (req, res) => {
    let category;
    let salesSum;
    try {
        category = new TicketsCategory(db, req.params.id);
        await category.init();
        salesSum = await TicketSalesSummary.getAll(db, req.params.id);
    } catch (e) {
        res.redirect("/logout")
        return
    }
    let totalSold = 0;
    salesSum.forEach((item) => {
        totalSold += item.getTotalSoldTickets();
    })
    if (totalSold === 0) {
        await db.query('DELETE FROM AVAIL_TICKETS WHERE category_id = ?', [category.getId()]);
        await category.delete();
    } else{
        req.flash("error", "Δεν μπορείτε να διαγράψετε αυτή την κατηγορία εισιτηρίων, καθώς υπάρχουν πωλήσεις που σχετίζονται με αυτήν.")
    }

    res.sendStatus(204)
});

router.delete('/api/deleteTicketAvailability/:id', async (req, res) => {
    let availability
    let salesSum
    try {
        availability = new AvailableTickets(db, req.params.id);
        await availability.init()
        salesSum = new TicketSalesSummary(db, req.params.id);
        await salesSum.init()
    } catch (e) {
        res.redirect("/logout")
        return
    }
    if (salesSum.getTotalSoldTickets() === 0) availability.delete()
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

    try {
        const user = await WP_User.create(
            db,
            req.body.username,
            crypto.randomBytes(100).toString('hex').slice(0, 100),
            req.body.displayName,
            email
        )
        await user.init()
    } catch (e) {
        req.flash("error", e.message)
    }

    res.redirect(303, '/admin/user-list')
})

router.get('/api/getUser/:id', async (req, res) => {
    let user
    try {
        user = new WP_User(
            db,
            req.params.id
        )
        await user.init()
    } catch (e) {
        res.redirect("/logout")
        return
    }
    const data = {
        "id": user.getId(),
        "displayName": user.getDisplayName(),
        "email": user.getEmail().getEmail(),
    }
    res.send(data);
})

router.post('/api/editUser', async (req, res) => {
    try {
        const user = new WP_User(
            db,
            req.body.userId,
        )
        await user.init()
        await user.updateDisplayName(req.body.displayName)
        await user.getEmail().updateEmail(req.body.userEmail)
    } catch (e) {
        req.flash("error", e.message)
    }
    res.redirect(303, '/admin/user-list')
})

router.delete('/api/deleteUser/:id', async (req, res) => {
    try {
        const user = new WP_User(
            db,
            req.params.id
        )
        await user.init()
        await user.delete()
    } catch (e) {
        res.redirect("/logout")
        return
    }
    res.sendStatus(204)
})

export default router;