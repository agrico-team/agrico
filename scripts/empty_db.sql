-- Removes all the rows from all the tables, without dropping the tables themselves.

\c agricodb

BEGIN;
TRUNCATE listing_category CASCADE;
TRUNCATE user_account CASCADE;
TRUNCATE listing CASCADE;
TRUNCATE user_message CASCADE;
TRUNCATE post CASCADE;
TRUNCATE comment CASCADE;
TRUNCATE impression CASCADE;
TRUNCATE media CASCADE;
TRUNCATE user_order CASCADE;
TRUNCATE order_item CASCADE;
END;