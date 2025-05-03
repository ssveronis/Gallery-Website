import DB from "../db.js";
// @ts-ignore
import TicketsCategory from "./tickets_category.ts";

class AvailableTickets {
    private db: DB = null;
    private id: number = null;

    private categoryId: number = null;
    private category: TicketsCategory = null;
    private date = null;
    private startTime = null;
    private endTime = null;
    private maxTickets: number = null;

    constructor(db: DB, id: number) {
        this.db = db;
        if (!this.db.ready) throw new Error("Database not ready");
        this.id = id;
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM AVAIL_TICKETS WHERE id = '${this.id}'`)
        if (res.length === 0) throw new Error("Available Tickets not found");
        this.categoryId = res[0].category_id;
        this.date = res[0].date;
        this.startTime = res[0].start_time;
        this.endTime = res[0].end_time;
        this.maxTickets = res[0].max_tickets;
        this.category = new TicketsCategory(this.db, this.categoryId);
        await this.category.init();
    }

    static async create(db: DB, date, startTime, endTime, maxTickets, category: TicketsCategory) {
        if (!db.ready) throw new Error("Database not ready");
        await db.query(`INSERT INTO AVAIL_TICKETS (category_id, date, start_time, end_time, max_tickets) VALUES ('${category.getId()}', '${date}', '${startTime}', '${endTime}', '${maxTickets}')`);
        return new AvailableTickets(db, category.getId());
    }

    static async getAll(db: DB){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT id FROM AVAIL_TICKETS`)
        const availableTickets = res.map(availableTicket => new AvailableTickets(db, availableTicket.id))
        for (const ticket of availableTickets) await ticket.init()
        return availableTickets;
    }

    //Need to implement search by date and time

    getCategoryId(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        return this.categoryId;
    }

    getCategory(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        return this.category;
    }

    getDate(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        return this.date;
    }

    getStartTime(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        return this.startTime;
    }

    getEndTime(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        return this.endTime;
    }

    getMaxTickets(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        return this.maxTickets;
    }

    async updateMaxTickets(maxTickets: number){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        await this.db.query(`UPDATE AVAIL_TICKETS SET max_tickets = '${maxTickets}' WHERE id = ${this.id}`);
        await this.init()
    }

    delete(){
        if (!this.categoryId) throw new Error("Available Tickets not found");
        this.db.query(`DELETE FROM AVAIL_TICKETS WHERE id = ${this.id}`);
    }
}

export default AvailableTickets;