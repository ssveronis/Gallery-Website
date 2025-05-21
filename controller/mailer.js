import nodemailer from 'nodemailer';
import DB, { Email, Person, TicketsCategory, AvailableTickets, TicketSales, WP_User, TicketSalesSummary, PasswdForgotTokens, getAvailTicketSearch } from "../db.js";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
    },
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

export async function sendMailResetPasswd(domain, email, token){
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Αλλαγή κωδικού",
        text: `${domain}/password-reset/${token}`
    })
}

export async function sendMailRegister(domain, email){
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Γειά σου",
        text: `${domain} hi!`
    })
}

export async function sendMailBuy(domain, sale){
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: sale.getPerson().getEmail().getEmail(),
        subject: "Αγορά",
        text: `${sale}`
    })
}