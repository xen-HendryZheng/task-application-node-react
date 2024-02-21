
// Envvars for default database connection
export const PGDATABASE = process.env.PG_DATABASE || 'checkbox-system';
export const PGHOST = process.env.PGHOST || 'localhost';
export const PGPORT = Number(process.env.PGPORT) || 5432;
export const PGUSER = process.env.PGUSER || 'testuser';
export const PGPASSWORD = process.env.PGPASSWORD || 'testpass';

export const JWT_SECRET = process.env.JWT_SECRET || 'HELLO_WORLD';

export const USER_SESSION = 'user';
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
export const JWT_DURATION_HOUR = Number(process.env.JWT_DURATION_HOUR) || 24;
export const DAYS_DUE_SOON = Number(process.env.DAYS_DUE_SOON) || 7;
export const LIMIT_BATCH_WORKER = Number(process.env.LIMIT_BATCH_WORKER) || 100;

export const CLICKHOUSE_HOST = process.env.CLICKHOUSE_HOST || 'http://localhost:8123';
export const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER || 'default';
export const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD || '';
export const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE || 'checkbox_system_postgres';