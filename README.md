CodeChain keystore server [![Build Status](https://travis-ci.org/CodeChain-io/codechain-keystore-server.svg?branch=master)](https://travis-ci.org/CodeChain-io/codechain-keystore-server)
==========================

CodeChain keystore server is a private key management server. It saves CodeChain's asset transfer address safely in a database. You should use this keystore server to save your private key safely in CodeChain SDK.

## Installation

### Prerequisite

1. Install PostgreSQL

### Initial Configuration

1. Install dependencies with `yarn install`
1. Execute the following SQL queries
```sql
CREATE DATABASE "codechain-keystore";
CREATE USER "codechain" WITH ENCRYPTED PASSWORD 'DATABASE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE "codechain-keystore" TO "codechain";
```
1. Create `config/local.json` with the following data
```json
{
    "knex": {
        "connection": {
            "password": "DATABASE_PASSWORD"
        }
    }
}
```
1. Update the database with `yarn migrate`
1. Seed the database with `yarn seed`

## Usage

- `yarn start` to start a server
- `yarn load` to load local keystore to database
- `yarn lint` to lint the entire source code
- `yarn fmt` to apply formatters
- `yarn migrate` to migrate the database
- `yarn rollback` to rollback the database
- `yarn seed` to reset and seed the database

### Check if the server is alive

You can send a ping to the server to check if it's up and running.

```
curl http://localhost:7007/ping
```
