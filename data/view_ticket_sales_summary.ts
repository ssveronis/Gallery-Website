import DB from "../db.js";

class TicketSalesSummary {
    private db: DB;

    private id: number = null;
    private category_id: number = null;
    private date = null;
    private startTime = null;
    private endTime = null;
    private maxTickets: number = null;
    private totalSoldTickets: number = null;
    private availableTickets: number = null;

    constructor(db: DB, id: number) {
        this.db = db
        if (!this.db.ready) throw new Error("Database not ready");
        this.id = id;
    }

    async init() {
        const res = await this.db.query(`SELECT id, category_id, date, start_time, end_time, max_tickets, SUM(total_regular_tickets + total_children_tickets + total_student_tickets) AS total_sold_tickets, max_tickets - SUM(total_regular_tickets + total_children_tickets + total_student_tickets) AS available_tickets FROM view_ticket_sales_summary WHERE id = ?;`, [this.id])
        if (res.length === 0) throw new Error("Ticket Sales not found");
        this.category_id = res[0].category_id;
        this.date = res[0].date;
        this.startTime = res[0].start_time;
        this.endTime = res[0].end_time;
        this.maxTickets = res[0].max_tickets;
        this.totalSoldTickets = res[0].total_sold_tickets===null?0:res[0].total_sold_tickets;
        this.availableTickets = res[0].available_tickets===null?this.maxTickets:res[0].available_tickets;
    }

    static async getAll(db: DB, category_id?: number) {
        if (!db.ready) throw new Error("Database not ready");

        let query = `SELECT id FROM view_ticket_sales_summary`;
        if (category_id !== undefined) {
            query += ` WHERE category_id = ${category_id} ORDER BY date DESC, start_time DESC`;
        }

        const res = await db.query(query);
        const summary = res.map(s => new TicketSalesSummary(db, s.id));
        for (const s of summary) await s.init();
        return summary;
    }


    getId(){
        return this.id;
    }

    getCategoryId(){
        return this.category_id;
    }

    getDate(){
        return this.date;
    }

    getStartTime(){
        return this.startTime;
    }

    getEndTime(){
        return this.endTime;
    }

    getMaxTickets(){
        return this.maxTickets;
    }

    getTotalSoldTickets(){
        if (this.totalSoldTickets) return this.totalSoldTickets;
        else return 0;
    }

    getAvailableTickets(){
        if (this.availableTickets) return this.availableTickets;
        else return 0;
    }
}

export default TicketSalesSummary;