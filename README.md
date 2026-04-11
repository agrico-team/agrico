## Scripts
These are useful scripts for creating the schema from scratch, emptying it out of data, or destroying the database completely.

## scripts/bat/create_db.bat
Destroys the existing database. 
Then, recreates it from scratch.

## scripts/bat/destroy_db.bat
Permanently destroys the existing database (drops tables, indexes, enums, etc.).

## scripts/bat/empty_db.bat
Empties the database of data, without dropping the tables themselves.

## Notes
The database created is named "agricodb".