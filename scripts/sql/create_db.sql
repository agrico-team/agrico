-- This will create the database from scratch.

-- Connect to the default postgres db, because a db can't be destroyed while connected to it.
\c postgres
DROP DATABASE IF EXISTS agricodb;

CREATE DATABASE agricodb;
\c agricodb
CREATE SCHEMA IF NOT EXISTS agrico;
ALTER DATABASE agricodb SET search_path TO agrico, public;

BEGIN;

-- TODO: better way to figure out the paths of the .sql scripts.
\i ../../schemas/user_data.sql;
\i ../../schemas/listings.sql;
\i ../../schemas/listing_purchases.sql;
\i ../../schemas/media.sql;
\i ../../schemas/engagements.sql;

COMMIT;