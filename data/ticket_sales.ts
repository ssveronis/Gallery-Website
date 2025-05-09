import DB from "../db.js";
// @ts-ignore
import AvailableTickets from "./available_tickets.ts";
// @ts-ignore
import Person from "./person.ts";

class TicketSales {
    private db: DB;
    private id: number;

    private timestamp: number = null;
    private regularTickets: number = null;
    private childrenTickets: number = null;
    private studentTickets: number = null;
    private audioguides: number = null;
    private total: number = null;
    private accessibility: boolean = null;
    private personId: number = null;
    private person: Person = null;
    private availableTicketsId: number = null;
    private availableTickets: AvailableTickets = null;

    constructor(db: DB, id: number) {
        this.db = db
        if (!this.db.ready) throw new Error("Database not ready");
        this.id = id;
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM TICKET_SALES WHERE id = '${this.id}'`)
        if (res.length === 0) throw new Error("Ticket Sales not found");
        this.timestamp = res[0].timestamp;
        this.regularTickets = res[0].regular_tickets;
        this.childrenTickets = res[0].children_tickets;
        this.studentTickets = res[0].student_tickets;
        this.audioguides = res[0].audioguides;
        this.total = res[0].total;
        this.accessibility = res[0].accessibility;
        this.personId = res[0].buyer_id;
        this.person = new Person(this.db, this.personId);
        await this.person.init();
        this.availableTicketsId = res[0].avail_id;
        this.availableTickets = new AvailableTickets(this.db, this.availableTicketsId);
        await this.availableTickets.init();
    }

    static async getAll(db: DB){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query("SELECT id FROM TICKET_SALES")
        const ticketSales = res.map(ticketSale => new TicketSales(db, ticketSale.id))
        for (const ticket of ticketSales) await ticket.init()
        return ticketSales;
    }

    static async create(db: DB, regularTickets: number, childrenTickets: number, studentTickets: number, audioguides: number, person: Person, availableTickets: AvailableTickets){
        if (!db.ready) throw new Error("Database not ready");
        await db.query("INSERT INTO TICKET_SALES (regular_tickets, children_tickets, student_tickets, audioguides, accessibility, buyer_id, avail_id) VALUES (${regularTickets}, ${childrenTickets}, ${studentTickets}, ${audioguides}, ${accessibility}, ${person.getId()}, ${availableTickets.getId()})")
        const res = await db.query("SELECT LAST_INSERT_ID();")
        return new TicketSales(db, res[0].LAST_INSERT_ID());
    }

    static async searchByFirstName(db: DB, search: string){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT TICKET_SALES.id FROM TICKET_SALES JOIN PERSON ON TICKET_SALES.buyer_id = PERSON.id WHERE PERSON.first_name LIKE "%${search}%";`)
        const ticketSales = res.map(ticketSale => new TicketSales(db, ticketSale.id))
        for (const ticket of ticketSales) await ticket.init()
        return ticketSales;
    }

    static async searchByLastName(db: DB, search: string){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT TICKET_SALES.id FROM TICKET_SALES JOIN PERSON ON TICKET_SALES.buyer_id = PERSON.id WHERE PERSON.last_name LIKE "%${search}%";`)
        const ticketSales = res.map(ticketSale => new TicketSales(db, ticketSale.id))
        for (const ticket of ticketSales) await ticket.init()
        return ticketSales;
    }

    static async searchByPhoneNumber(db: DB, search: string){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT TICKET_SALES.id FROM TICKET_SALES JOIN PERSON ON TICKET_SALES.buyer_id = PERSON.id WHERE PERSON.phone_number LIKE "%${search}%";`)
        const ticketSales = res.map(ticketSale => new TicketSales(db, ticketSale.id))
        for (const ticket of ticketSales) await ticket.init()
        return ticketSales;
    }

    static async searchByCategoryName(db: DB, search: string){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT TICKET_SALES.id FROM TICKET_SALES JOIN AVAIL_TICKETS ON TICKET_SALES.avail_id = AVAIL_TICKETS.id JOIN TICKETS_CATEGORY ON AVAIL_TICKETS.id = TICKETS_CATEGORY.id WHERE TICKETS_CATEGORY.name LIKE "%${search}%";`)
        const ticketSales = res.map(ticketSale => new TicketSales(db, ticketSale.id))
        for (const ticket of ticketSales) await ticket.init()
        return ticketSales;
    }

    getId(){
        if (!this.id) throw new Error("Ticket Sales not found");
        return this.id;
    }

    getDate(){
        if (!this.timestamp) throw new Error("Ticket Sales not found");
        return this.timestamp;
    }

    getRegularTickets(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.regularTickets;
    }

    getChildrenTickets(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.childrenTickets;
    }

    getStudentTickets(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.studentTickets;
    }

    getPerson(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.person;
    }

    getPersonId(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.personId;
    }

    getAudioguides(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.audioguides;
    }

    getTotal(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.total;
    }

    getAccessibility(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.accessibility
    }

    getAvailableTickets(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.availableTickets;
    }

    getAvailableTicketsId(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        return this.availableTicketsId;
    }

    delete(){
        if (!this.regularTickets) throw new Error("Ticket Sales not found");
        this.db.query(`DELETE FROM TICKET_SALES WHERE id = ${this.id}`);
    }
}

export default TicketSales;