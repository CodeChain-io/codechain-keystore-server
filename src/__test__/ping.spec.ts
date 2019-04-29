import { Application } from "express";
import * as request from "supertest";
import { createApp } from "../app";

let app: Application;

beforeEach(async () => {
    app = await createApp();
});

test("ping", async () => {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
});
