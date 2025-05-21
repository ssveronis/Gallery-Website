import DB from "../db.js";
// @ts-ignore
import WP_User from "./wp_users.ts";

export default class PasswdForgotTokens {

    private db: DB;

    private id: number = null;
    private token: string = null;
    private timestamp: Date = null;
    private user: WP_User = null;

    constructor(db: DB, token:string) {
        this.db = db;
        if (!this.db.ready) throw new Error("Database not ready");
        this.token = token
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM PASSWD_FORGOT_TOKENS WHERE token = ?`, [`${this.token}`])
        if (res.length === 0) throw new Error("Passwd Forgot Token not found");
        this.id = res[0].id;
        this.timestamp = new Date(res[0].timestamp);
        this.user = new WP_User(this.db, this.id);
        await this.user.init();
    }

    static async create(db: DB, token:string, user: WP_User) {
        if (!db.ready) throw new Error("Database not ready");
        await db.query(`INSERT INTO PASSWD_FORGOT_TOKENS (id, token) VALUES (?, ?)`, [user.getId(), token]);
        return new PasswdForgotTokens(db, token);
    }

    getUserId(){
        if (!this.id) throw new Error("Passwd Forgot Token not found");
        return this.user.getId();
    }

    getUser(){
        if (!this.id) throw new Error("Passwd Forgot Token not found");
        return this.user;
    }

    getTimestamp(){
        if (!this.id) throw new Error("Passwd Forgot Token not found");
        return this.timestamp;
    }

    getToken(){
        if (!this.id) throw new Error("Passwd Forgot Token not found");
        return this.token;
    }

    async delete(){
        if (!this.id) throw new Error("Passwd Forgot Token not found");
        this.db.query(`DELETE FROM PASSWD_FORGOT_TOKENS WHERE token = ?`, [this.token]);
    }
}