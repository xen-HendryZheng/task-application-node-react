
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