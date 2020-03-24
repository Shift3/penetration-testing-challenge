# Shift3 Penetration Testing Challenge

This project is an intentionally vulnerable and exploitable blogging application to be used as a penetration testing security challenge. It also represents a solid list of things to NOT do as a web developer. Don't use this code in production; you'll have a bad time.

The goal of the challenge is to identify, execute, and document web vulnerabilities found within the application.

**Note for contributors:** This project is intentionally exploitable. Please do not submit PRs to fix vulnerabilities. These should be left for future challengers to discover.

## The Challenge

Follow the directions in [Penetration Testing Challenge](./pentest-challenge.md) to show off your penetration testing skills.

## Project Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - This project uses Docker to spin up multiple VMs (server, client, and database)
- Command Line / Terminal to execute docker commands

### Recommended Software

- An IDE or source code editor ([Visual Studio Code](https://code.visualstudio.com/) recommended)
- A database client ([DBeaver](https://dbeaver.com/) recommended)

## Project Layout

This is description of the folders in this project. You are allowed to analyze the source code in your search for vulnerabilities and exploits as detailed below.

- /application
  - This is the main directory for the blog application. It contains all of the source code required for the main app to function (client and server code). This is where you should spend most of your focus searching for exploits.
  - This is an [MVC-style](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) application using NodeJS, Express, and Jade templates.
- /database
  - Contains the Dockerfile and SQL scripts to initialize the Postgres container. This code is primarily in place to setup the project and should not be a main focus for vulnerabilities.
- /third-party-server
  - This directory contains a server application which represents a third-party server on the Internet. You are not looking for vulnerabilities within this application, although it will be directly involved with vulnerabilities you find within the main blog application.

## Getting Started

Clone the repository. To start the application, run the following command in a terminal from the root repository directory:

```bash
docker-compose up
```  

This command can take at least five minutes when it is run for the first time. This will initialize 4 docker containers:

- **penetration-testing-challenge_application**
  - The main application server.
  - The app can be accessed via `http://localhost:8080`
- **penetration-testing-challenge_postgres**
  - The database instance.
  - The database can be accessed by a database client via `localhost:5432`
  - See `.env` file for credentials
- **penetration-testing-challenge_third-party-server**
  - The third-party api server.
  - The server can be accessed via `http://localhost:3000`
- **penetration-testing-challenge_migrations**
  - This container sets up and seeds the database.
  - No external access.

Use a web browser and navigate to `http://localhost:8080` to view the web interface.

### Stopping Docker

You can use `ctrl-c` in your terminal to stop the running Docker containers. `docker-compose up` will bring them back online.

### Deleting Project Docker Resources

You can type `docker-compose down` to delete all containers associated with this application.

**NOTE:** This will also delete the volume associated with the database instance, meaning all database content will be deleted.

*This is useful if you want to drop and reseed your database. Just run `docker-compose down` follow by `docker-compose up` and you'll have a freshly-seeded database!*
