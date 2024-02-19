import "reflect-metadata"
import { DataSource } from "typeorm"
import { entities } from "./typeorm/entities"
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from "./config"

console.log(PGHOST, PGPORT, PGUSER, PGDATABASE)

export const AppDataSource = new DataSource({
    type: "postgres",
    host: PGHOST,
    port: PGPORT,
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    synchronize: true,
    logging: false,
    entities: entities,
    migrations: [
    ],
    subscribers: [],
    extra: {
        // db.getClient wait time on a full pool connection before timing out
        connectionTimeoutMillis: 30000,

        // time before the pool releases the client and db.getClient has to reconnect
        idleTimeoutMillis: 60000,

        // time to consider query is taking too long
        statement_timeout: 360000, // 6 minutes
    }
})
