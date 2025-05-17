import DB from "../db.js";

class Email {
    private db: DB;
    private emailORid: string | number;

    private id: number = null;
    private email: string = null;
    private newsletter: boolean = null;

    constructor(db: DB, id: number);
    constructor(db: DB, email: string);

    constructor(db: DB, emailORid: string | number) {
        this.db = db;
        if (!this.db.ready) throw new Error("Database not ready");
        this.emailORid = emailORid;
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM EMAIL WHERE email = '${this.emailORid}' OR id = '${this.emailORid}'`)
        if (res.length === 0) throw new Error("Email not found");
        this.id = res[0].id;
        this.email = res[0].email;
        this.newsletter = res[0].newsletter;
    }

    static async create(db: DB, email: string, newsletter: boolean = false) {
        if (!db.ready) throw new Error("Database not ready");
        await db.query(`INSERT INTO EMAIL (email, newsletter) VALUES ('${email}', ${newsletter})`);
        return new Email(db, email);
    }

    static async getAll(db: DB) {
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT id FROM EMAIL`);
        const emails = res.map(email => new Email(db, email.id));
        for (const email of emails) await email.init();
        return emails;
    }

    static async searchByEmail(db: DB, search: string){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT id FROM EMAIL WHERE email LIKE "%${search}%"`)
        const emails = res.map(email => new Email(db, email.id));
        for (const email of emails) await email.init();
        return emails;
    }

    getId(){
        if (!this.id) throw new Error("Email not found");
        return this.id;
    }

    getEmail(){
        if (!this.id) throw new Error("Email not found");
        return this.email;
    }

    async updateEmail(email: string){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE EMAIL SET email = '${email}' WHERE id = ${this.id}`);
        this.emailORid = this.id
        await this.init();
    }

    getNewsletter(){
        if (!this.id) throw new Error("Email not found");
        return this.newsletter;
    }

    async updateNewsletter(newsletter: boolean){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE EMAIL SET newsletter = ${newsletter} WHERE id = ${this.id}`);
        this.emailORid = this.id
        await this.init();
    }

    delete(){
        if (!this.id) throw new Error("Email not found");
        this.db.query(`DELETE FROM EMAIL WHERE id = ${this.id}`);
    }
}

export default Email;