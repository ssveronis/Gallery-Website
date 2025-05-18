import DB from "../db.js";

class TicketsCategory {
    private db: DB;
    private idORname: string | number;

    private id: number = null;
    private name: string = null;
    private regularPrice: number = null;
    private childrenPrice: number = null;
    private studentPrice: number = null;
    private audioguidePrice: number = null;
    private canAccAMEA: boolean = null;

    constructor(db: DB, id: number);
    constructor(db: DB, name: string);

    constructor(db: DB, idORname: string | number) {
        this.db = db;
        if (!this.db.ready) throw new Error("Database not ready");
        this.idORname = idORname;
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM TICKETS_CATEGORY WHERE id = '${this.idORname}' OR name = '${this.idORname}'`)
        if (res.length === 0) throw new Error("Tickets Category not found");
        this.id = res[0].id;
        this.name = res[0].name;
        this.regularPrice = res[0].regular_price;
        this.childrenPrice = res[0].children_price;
        this.studentPrice = res[0].student_price;
        this.audioguidePrice = res[0].audioguide_price;
        this.canAccAMEA = res[0].can_acc_AMEA;
    }

    static async create(db:DB, name: string, regularPrice: number, childrenPrice: number, studentPrice: number, audioguidePrice: number, canAccAMEA: boolean){
        if (!db.ready) throw new Error("Database not ready");
        await db.query(`INSERT INTO TICKETS_CATEGORY (name, regular_price, children_price, student_price, audioguide_price, can_acc_AMEA) VALUES ('${name}', '${regularPrice}', '${childrenPrice}', '${studentPrice}', '${audioguidePrice}', '${canAccAMEA}')`);
        return new TicketsCategory(db, name);
    }

    static async getAll(db: DB){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT id FROM TICKETS_CATEGORY`);
        const categories = res.map(category => new TicketsCategory(db, category.id))
        for (const category of categories) await category.init()
        return categories
    }

    static async getAllWithAvail(db: DB){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT * FROM TICKETS_CATEGORY WHERE EXISTS (SELECT 1 FROM view_ticket_sales_summary WHERE TICKETS_CATEGORY.id = view_ticket_sales_summary.category_id AND view_ticket_sales_summary.date > CURRENT_DATE() OR (view_ticket_sales_summary.date = CURRENT_DATE() AND view_ticket_sales_summary.start_time > CURRENT_TIME()) AND view_ticket_sales_summary.max_tickets > (view_ticket_sales_summary.total_regular_tickets + view_ticket_sales_summary.total_children_tickets + view_ticket_sales_summary.total_student_tickets));`);
        const categories = res.map(category => new TicketsCategory(db, category.id))
        for (const category of categories) await category.init()
        return categories
    }

    static async searchByName(db: DB, search: string){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT id FROM TICKETS_CATEGORY WHERE name LIKE "%${search}%";`);
        const categories = res.map(category => new TicketsCategory(db, category.id))
        for (const category of categories) await category.init()
        return categories
    }

    getId(){
        if (!this.id) throw new Error("Email not found");
        return this.id;
    }

    getName(){
        if (!this.id) throw new Error("Email not found");
        return this.name;
    }

    async updateName(name: string){
        if (!this.id) throw new Error("Email not found");
        this.db.query(`UPDATE TICKETS_CATEGORY SET name = '${name}' WHERE id = ${this.id}`);
        this.idORname = this.id
        this.init();
    }

    getRegularPrice(){
        if (!this.id) throw new Error("Email not found");
        return this.regularPrice;
    }

    async updateRegularPrice(regularPrice: number){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE TICKETS_CATEGORY SET regular_price = '${regularPrice}' WHERE id = ${this.id}`);
        this.idORname = this.id
        await this.init();
    }

    getChildrenPrice(){
        if (!this.id) throw new Error("Email not found");
        return this.childrenPrice;
    }

    async updateChildrenPrice(childrenPrice: number){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE TICKETS_CATEGORY SET children_price = '${childrenPrice}' WHERE id = ${this.id}`);
        this.idORname = this.id
        await this.init();
    }

    getStudentPrice(){
        if (!this.id) throw new Error("Email not found");
        return this.studentPrice;
    }

    async updateStudentPrice(studentPrice: number){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE TICKETS_CATEGORY SET student_price = '${studentPrice}' WHERE id = ${this.id}`);
        this.idORname = this.id
        await this.init();
    }

    getAudioguidePrice(){
        if (!this.id) throw new Error("Email not found");
        return this.audioguidePrice;
    }

    async updateAudioguidePrice(audioguidePrice: number){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE TICKETS_CATEGORY SET audioguide_price = '${audioguidePrice}' WHERE id = ${this.id}`);
        this.idORname = this.id
        await this.init();
    }

    getCanAccAMEA(){
        if (!this.id) throw new Error("Email not found");
        return this.canAccAMEA;
    }

    async updateCanAccAMEA(canAccAMEA: boolean){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE TICKETS_CATEGORY SET can_acc_AMEA = '${canAccAMEA}' WHERE id = ${this.id}`);
        this.idORname = this.id
        await this.init();
    }

    delete(){
        if (!this.id) throw new Error("Email not found");
        this.db.query(`DELETE FROM TICKETS_CATEGORY WHERE id = ${this.id}`);
    }

}

export default TicketsCategory;