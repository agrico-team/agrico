-- Removes all the rows from all the tables, without dropping the tables themselves.

\c agricodb

BEGIN;

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'agrico') 
    LOOP
        EXECUTE 'TRUNCATE TABLE agrico.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

COMMIT;