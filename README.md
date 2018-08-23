CodeChain keystore server [![Build Status](https://travis-ci.org/CodeChain-io/codechain-keystore-server.svg?branch=master)](https://travis-ci.org/CodeChain-io/codechain-keystore-server)
==========================

CodeChain keystore server is a private key management server. It saves CodeChain's asset transfer address safely in a disk. You should use this keystore server to save your private key safely in CodeChain SDK.

Install
--------

Run `yarn install`

Run `yarn pm2 install typescript`

Run `yarn pm2 install pm2-logrotate`

Run
--------

Run `yarn pm2 start ecosystem.config.js`

Send a ping to the server to check if it's up and running.

```
curl http://localhost:7007/ping
```

The server responds with `{"success":true}`.

How your private key is saved
-------------------

We use SQLite to save an encrypted private key. You can find the SQLite file in `./keystore.db`
