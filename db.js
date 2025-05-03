import mariadb from 'mariadb';
import fs from 'fs';

class DB{

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
            "socketTimeout": 500,
            "queryTimeout": 100
        })

        this.ready = true;
    }

}

export default DB;