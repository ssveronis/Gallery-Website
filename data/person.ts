import DB from "../db.js";
// @ts-ignore
import Email from "./email.ts";

class Person {
    private db: DB;
    private id: number;

    private personId: number = null;
    private personFirstName: string = null;
    private personLastName: string = null;
    private personPhoneCountryCode: number = null;
    private personPhoneNumber: number = null;
    private personEmail: Email = null;

    constructor(db: DB, id: number) {
        this.db = db;
        if (!this.db.ready) throw new Error("Database not ready");
        this.id = id;
    }

    async init(){
        const res = await this.db.query(`SELECT * FROM PERSON WHERE id = '${this.id}'`)
        if (res.length === 0) throw new Error("Person not found");
        this.personId = res[0].id;
        this.personFirstName = res[0].first_name;
        this.personLastName = res[0].last_name;
        this.personPhoneCountryCode = res[0].phone_country;
        this.personPhoneNumber = res[0].phone_number;
        this.personEmail = new Email(this.db, this.personId);
        await this.personEmail.init();
    }

    static async create(db: DB, first_name: string, last_name: string, phone_country: number, phone_number: number, email: Email) {
        if (!db.ready) throw new Error("Database not ready");
        await db.query(`INSERT INTO PERSON (first_name, last_name, phone_country, phone_number, email_id) VALUES ('${first_name}', '${last_name}', '${phone_country}', '${phone_number}', '${email.getId()}')`);
        return new Person(db, email.getId());
    }

    static async getAll(db: DB){
        if (!db.ready) throw new Error("Database not ready");
        const res = await db.query(`SELECT * FROM PERSON`);
        const persons = res.map(person => new Person(db, person.id))
        for (const person of persons) await person.init()
        return persons;
    }

    getFirstName(){
        if (!this.personId) throw new Error("Person not found");
        return this.personFirstName;
    }

    async updateFirstName(firstName: string){
        if (!this.personId) throw new Error("Person not found");
        this.db.query(`UPDATE PERSON SET first_name = '${firstName}' WHERE id = ${this.personId}`);
        await this.init();
    }

    getLastName(){
        if (!this.personId) throw new Error("Person not found");
        return this.personLastName;
    }

    async updateLastName(lastName: string){
        if (!this.personId) throw new Error("Person not found");
        this.db.query(`UPDATE PERSON SET last_name = '${lastName}' WHERE id = ${this.personId}`);
        await this.init();
    }

    getPhoneCountryCode(){
        if (!this.personId) throw new Error("Person not found");
        return this.personPhoneCountryCode;
    }

    async updatePhoneCountryCode(phoneCountryCode: number){
        if (!this.personId) throw new Error("Person not found");
        this.db.query(`UPDATE PERSON SET phone_country = '${phoneCountryCode}' WHERE id = ${this.personId}`);
        await this.init();
    }

    getPhoneNumber(){
        if (!this.personId) throw new Error("Person not found");
        return this.personPhoneNumber;
    }

    async updatePhoneNumber(phoneNumber: number){
        if (!this.personId) throw new Error("Person not found");
        this.db.query(`UPDATE PERSON SET phone_number = '${phoneNumber}' WHERE id = ${this.personId}`);
        await this.init();
    }

    getEmail(){
        if (!this.personId) throw new Error("Person not found");
        return this.personEmail;
    }

    getIds(){
        if (!this.personId) throw new Error("Person not found");
        return this.personId;
    }

    delete(){
        if (!this.personId) throw new Error("Person not found");
        this.db.query(`DELETE FROM PERSON WHERE id = ${this.personId}`);
    }
}

export default Person;