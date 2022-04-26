# Northcoders News API

## Description

### Technical

This is a backend API project made as part of my time on the [Northcoders Bootcamp](https://northcoders.com).

It is a restful server made with Express.js that connects to (and serves data from) a Postgres (aka PostgreSQL) database. It was created using TDD with Jest.

A hosted version can be found [here](https://nc-news-mezz-davies.herokuapp.com/api/).

### Creative

It is a reddit-style API where users are able to view articles and vote on them (up or down) as well as view, post and delete related comments. Users can also view articles according to topic categories, and view a list of all other users as well as an individual user's information. A full list of end points is available (in .JSON format) on the above link.

## Installation and Running in Test Mode

### Clone

From the location you want to install the repo run:

```bash
git clone https://github.com/mezzDavies/northcoders-be-project.git
```

### Install Dependencies

cd into the repo and:

```bash
npm i
```

This will install the required depencencies of the repo.

### .ENV

You now need to create two new files at the root level of the repo. This is because they are git ignored (for best practices) and therefore not included in the repo. These .env files are used to be able to access the correct (local) databases (installation instructions for the databases are below).

Create these two files at the root level of the repo:

.env.development

and

.env.test

Then set the contents of each .env file to be the following string (without the quotes) - "PGDATABASE=database_name" where "database_name" is replaced with the corresponding database name from the setup.sql file.

The correct database will now automatically be connected to at runtime depending on whether you are running the server in test or development mode.

### Databases

You will need Postgres installed on your machine to be able to acheieve the below.

To create the databases use the command:

```bash
npm run setup-dbs
```

Then populate the databases with the correct data:

```bash
npm run seed
```

### Running Tests

You are now in a position to run the tests included in the test directory:

```bash
npm t
```

This will run the unit tests that were written for the development of the app - ./**tests**/app.test.js.

## Minimum Versions

This api is tested only with postgres (PostgreSQL) v14.1 and Node v16.x.x
