## Scripts
These are useful scripts for creating the database from scratch, emptying it out of data, or destroying the database completely. They make testing much quicker and easier.

## scripts/bat/create_db.bat
Destroys the existing database. 
Then, recreates it from scratch.

## scripts/bat/destroy_db.bat
Permanently destroys the existing database (drops tables, indexes, enums, etc.).

## scripts/bat/empty_db.bat
Empties the database of data, without dropping the tables themselves.

## Notes
The database created is named "agricodb".

## Future Plans
- Create a specialized user (maybe call it `agrico`)
- Add more useful constraints
- Scripts to populate the database with fake data (using `Faker`, a Python library)