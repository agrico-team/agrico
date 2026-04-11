-- This will create the database from scratch.

DROP DATABASE IF EXISTS agricodb;
CREATE DATABASE agricodb;
\c agricodb
\i schema.sql

-- Useful Enums