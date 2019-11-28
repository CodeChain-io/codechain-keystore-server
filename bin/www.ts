/**
 * Module dependencies.
 */

import * as program from "commander";
import * as debugModule from "debug";
import * as http from "http";
import { createApp } from "../src/app";

const debug = debugModule("www");

program.option("--port <port>", "port number", "7007").parse(process.argv);

main().catch(console.error);

async function main() {
    const app = await createApp();

    /**
     * Get port from environment and store in Express.
     */

    const port = normalizePort(program.port);
    app.set("port", port);

    /**
     * Create HTTP server.
     */

    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on("error", onError(port));
    server.on("listening", onListening(server));

    process.on("SIGINT", async () => {
        console.log("Closing server...");

        try {
            await new Promise((resolve, reject) => {
                server.close((err: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        } catch (err) {
            console.error(`Error at closing ${err}`);
        } finally {
            process.exit();
        }
    });
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const parsedPort = parseInt(val, 10);

    if (isNaN(parsedPort)) {
        // named pipe
        return val;
    }

    if (parsedPort >= 0) {
        // port number
        return parsedPort;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(port: any): (error: any) => void {
    return (error: any) => {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(server: any): () => void {
    return () => {
        const addr = server.address();
        const bind =
            typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        debug("Listening on " + bind);
    };
}
