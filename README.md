# Northcoders News API

To be able to access the correct (local) database you will need to add two .env files to the root of this repo:

.env.development

and

.env.test

These files will each contain a key-value pair to automatically set the correct database (via setting environment variables) to connect to. (The "correct" database depends on whether running the server in test or development mode.)

The contents (key-value pair) of each .env file should be a string (without the quotes) - "PGDATABASE=database_name" where database_name should be replaced with the corresponding database name from the setup.sql file.

These files are git ignored hence the need to add to the repo before deployment.
