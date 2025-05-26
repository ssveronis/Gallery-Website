import mariadb from 'mariadb';
import fs from 'fs';
import WP_User from "./data/wp_users.ts";
import Email from "./data/email.ts";

class DB {

    constructor() {
        //reading certificates from file
        try {
            this.caCert = [fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8")];
            this.clientKey = [fs.readFileSync(process.env.DB_SSL_CLIENT_KEY_PATH, "utf8")];
            this.clientCert = [fs.readFileSync(process.env.DB_SSL_CLIENT_CRT_PATH, "utf8")];
        } catch (e) {
            this.caCert = null;
            this.clientKey = null;
            this.clientCert = null;
        }

        this.ready = false;
        this.initDB()
    }

    async initDB(){
        if(this.caCert && this.clientKey && this.clientCert){
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
        } else {
            this.db = await mariadb.createConnection({
                "user": process.env.DB_USER,
                "password": process.env.DB_PASS,
                "host": process.env.DB_HOST,
                "port": process.env.DB_PORT,
                "database": process.env.DB_NAME,
                "compress": true,
                "connectTimeout": 500,
                "socketTimeout": 0,
                "queryTimeout": 200
            })
        }

        this.ready = true;

        if(process.argv[2] === "setup" && process.argv[3].includes("@")){
            const email = await Email.create(
                this,
                process.argv[3],
            )
            await email.init()
            await WP_User.create(
                this,
                "admin",
                "admin",
                "Administrator",
                email
            )
            process.exit(0)
        }
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
