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
        html: `<div style="max-width:480px;margin:40px auto;background:#f0f7f5;border-radius:18px;box-shadow:0 2px 16px rgba(7,113,135,0.10);padding:32px 24px 24px 24px;font-family:sans-serif;">  <div style="text-align:center;margin-bottom:24px;">    <img src="/public/img/Logo.png" alt="Gallery Logo" style="width:70px;margin-bottom:10px;">    <h2 style="color:#055661;font-size:1.7em;font-weight:700;margin:0 0 10px 0;">Ευχαριστούμε για την αγορά σας!</h2>    <p style="color:#055661;font-size:1.1em;margin:0;">Η συναλλαγή σας ολοκληρώθηκε με επιτυχία.</p>  </div>  <div style="background:#fff;border-radius:14px;padding:18px 16px 10px 16px;box-shadow:0 2px 10px rgba(7,113,135,0.07);margin-bottom:18px;">    <h3 style="color:#077187;font-size:1.15em;font-weight:600;margin:0 0 12px 0;text-align:center;">Στοιχεία Κράτησης</h3>    <table style="width:100%;border-collapse:collapse;font-size:1em;color:#055661;">      <tr>        <td style="padding:6px 0;font-weight:600;">Ημερομηνία:</td>        <td style="padding:6px 0;">${(new Date(sale.getAvailableTickets().getDate())).toLocaleDateString()}</td>      </tr>      <tr>        <td style="padding:6px 0;font-weight:600;">Ώρα εισόδου:</td>        <td style="padding:6px 0;">${sale.getAvailableTickets().getStartTime()} - ${sale.getAvailableTickets().getEndTime()}</td>      </tr>      <tr>        <td style="padding:6px 0;font-weight:600;">Κανονικά εισιτήρια:</td>        <td style="padding:6px 0;">${sale.getRegularTickets()}</td>      </tr>      <tr>        <td style="padding:6px 0;font-weight:600;">Παιδικά εισιτήρια:</td>        <td style="padding:6px 0;">${sale.getChildrenTickets()}</td>      </tr>      <tr>        <td style="padding:6px 0;font-weight:600;">Φοιτητικά εισιτήρια:</td>        <td style="padding:6px 0;">${sale.getStudentTickets()}</td>      </tr>      <tr>        <td style="padding:6px 0;font-weight:600;">Audioguides:</td>        <td style="padding:6px 0;">${sale.getAudioguides()}</td>      </tr>      <tr>        <td style="padding:8px 0 0 0;font-weight:700;border-top:1px solid #e0e7ef;">Σύνολο:</td>        <td style="padding:8px 0 0 0;font-weight:700;color:#077187;border-top:1px solid #e0e7ef;">${sale.getTotal()} €</td>      </tr>    </table>  </div>  <div style="text-align:center;color:#055661;font-size:1em;margin-bottom:10px;">    <p style="margin:0 0 8px 0;">Παρακαλούμε να έχετε μαζί σας το email αυτό κατά την είσοδό σας.</p>    <p style="margin:0;">Για οποιαδήποτε απορία, επικοινωνήστε μαζί μας στο <a href='mailto:${process.env.MAIL_USER}' style='color:#077187;text-decoration:none;font-weight:600;'>${process.env.MAIL_USER}</a>.</p>  </div></div>`
    })
}