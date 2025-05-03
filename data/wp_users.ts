import DB from "../db.js";
// @ts-ignore
import Email from "./email.ts";

class WP_Users {
    private db: DB;
    private idORuserLogin: string | number;

    private id: number = null;
    private userLogin: string = null;
    private userPassword: string = null;
    private userDisplayName: string = null;
    private userEmailId: number = null;
    private userEmail: Email = null;

    constructor(db: DB, id: number);
    constructor(db: DB, login: string);

    constructor(db: DB, idORuserLogin: string | number) {
        this.db = db;
        if (!this.db.ready) throw new Error("Database not ready");
        this.idORuserLogin = idORuserLogin;
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM WP_USERS WHERE user_login = '${this.idORuserLogin}' OR id = '${this.idORuserLogin}'`)
        if (res.length === 0) throw new Error("Email not found");
        this.id = res[0].id;
        this.userLogin = res[0].user_login;
        this.userPassword = res[0].user_pass;
        this.userDisplayName = res[0].display_name;
        this.userEmailId = res[0].email_id;
        this.userEmail = new Email(this.db, this.userEmailId);
        await this.userEmail.init();
    }

    static async create(db: DB, login: string, password: string, displayName: string, email: Email) {
        if (!db.ready) throw new Error("Database not ready");
        // Add logic to hash the password
        await db.query(`INSERT INTO WP_USERS (user_login, user_pass, display_name, email_id) VALUES ('${login}', '${password}', '${displayName}', '${email.getId()}')`);
        return new WP_Users(db, login);
    }

    static async getAll(db: DB) {
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT * FROM WP_USERS`);
        const users = res.map(user => new WP_Users(db, user.id));
        for (const user of users) await user.init();
        return users;
    }

    getId(){
        if (!this.id) throw new Error("Email not found");
        return this.id;
    }

    getLogin(){
        if (!this.id) throw new Error("Email not found");
        return this.userLogin;
    }

    getPassword(){
        if (!this.id) throw new Error("Email not found");
        return this.userPassword;
    }

    async updatePassword(password: string){
        if (!this.id) throw new Error("Email not found");
        // Add logic to hash the password
        await this.db.query(`UPDATE WP_USERS SET user_pass = '${password}' WHERE id = ${this.id}`);
        this.idORuserLogin = this.id
        await this.init();
    }

    getDisplayName(){
        if (!this.id) throw new Error("Email not found");
        return this.userDisplayName;
    }

    async updateDisplayName(displayName: string){
        if (!this.id) throw new Error("Email not found");
        await this.db.query(`UPDATE WP_USERS SET display_name = '${displayName}' WHERE id = ${this.id}`);
        this.idORuserLogin = this.id
        await this.init();
    }

    getEmailId(){
        if (!this.id) throw new Error("Email not found");
        return this.userEmailId;
    }

    getEmail(){
        if (!this.id) throw new Error("Email not found");
        return this.userEmail;
    }

}

export default WP_Users;