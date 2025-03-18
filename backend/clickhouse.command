CREATE DATABASE checkbox_system_postgres
ENGINE = MaterializedPostgreSQL('postgres:5432', 'checkbox_system', 'testuser', 'testpass');

CREATE user checkbox_user IDENTIFIED WITH sha256_password BY 'abc123';
CREATE ROLE checkbox;
GRANT SELECT ON checkbox_system_postgres.* TO checkbox;
GRANT checkbox TO checkbox_user;

