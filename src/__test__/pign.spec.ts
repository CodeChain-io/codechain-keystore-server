import { Application } from "express";
import { createApp } from "../app";
import * as request from "supertest";

let app: Application;

beforeEach(async () => {
    app = (await createApp())[0];
});

test("ping", async () => {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
});
