import { Application } from "express";
import * as request from "supertest";
import { createApp } from "../app";
import { closeContext, Context } from "../context";

let app: Application;
let context: Context;

beforeEach(async () => {
    const res = await createApp();
    app = res[0];
    context = res[1];
});

afterEach(async () => {
    await closeContext(context);
});

test("ping", async () => {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
});
