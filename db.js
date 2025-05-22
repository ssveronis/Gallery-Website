import mariadb from 'mariadb';
import fs from 'fs';

class DB {

    constructor() {
        //reading certificates from file
        this.caCert = [fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8")];
        this.clientKey = [fs.readFileSync(process.env.DB_SSL_CLIENT_KEY_PATH, "utf8")];
        this.clientCert = [fs.readFileSync(process.env.DB_SSL_CLIENT_CRT_PATH, "utf8")];

        this.ready = false;
        this.initDB()
    }

    async initDB(){
        this.db = await mariadb.createConnection({
            "user": process.env.DB_USER,
            "password": process.env.DB_PASS,
            "host": process.env.DB_HOST,
            "port": process.env.DB_PORT,
            "ssl": {
                ca: this.caCert,
                cert: this.clientCert,
                key: this.clientKey
            },
            "database": process.env.DB_NAME,
            "compress": true,
            "connectTimeout": 500,
            "socketTimeout": 0,
            "queryTimeout": 200
        })

        this.ready = true;
    }

    async query(query, params = []){
        return await this.db.query(query, params);
    }

    async close(){
        await this.db.end();
    }

}

export default DB;

export { default as Email } from "./data/email.ts";
export { default as WP_User } from "./data/wp_users.ts";
export { default as Person } from "./data/person.ts";
export { default as TicketsCategory } from "./data/tickets_category.ts";
export { default as AvailableTickets } from "./data/available_tickets.ts";
export { default as TicketSales } from "./data/ticket_sales.ts";
export { default as TicketSalesSummary } from "./data/view_ticket_sales_summary.ts";
export { default as PasswdForgotTokens } from  "./data/passwd_forgot_tokens.ts"
export { getAvailTicketSearch } from "./data/avail_ticket_search.ts";
