# Northcoders News API

After cloning create these files at the root level of the repo:

.env.development

and

.env.test

You need these files to be able to access the correct (local) database but they are git ignored (for best practices).

The contents (key-value pair) of each .env file should be set to a string (without the quotes) - "PGDATABASE=database_name" where "database_name" is replaced with the corresponding database name from the setup.sql file.

The correct database will then automatically be connected to (via setting environment variables). The "correct" database depends on whether you are running the server in test or development mode.
