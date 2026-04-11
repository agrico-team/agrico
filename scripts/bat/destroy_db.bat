@echo off
psql.exe -f ..\sql\destroy_db.sql postgresql://postgres:password@localhost