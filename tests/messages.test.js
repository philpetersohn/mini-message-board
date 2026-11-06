import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import request from "supertest";
import app from "../app.js";
import { messages, resetMessages } from "../routes/index.js";

describe("POST /new", () => {
  beforeEach(() => {
    resetMessages();
  });

  it("saves a message and redirects to the index", async () => {
    const response = await request(app)
      .post("/new")
      .type("form")
      .send({ messageUser: "Ada", messageText: "Nice to meet you" });

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "/");
    assert.deepEqual(
      { user: messages.at(-1).user, text: messages.at(-1).text },
      { user: "Ada", text: "Nice to meet you" },
    );

    const index = await request(app).get("/");
    assert.equal(index.status, 200);
    assert.match(index.text, /Ada/);
    assert.match(index.text, /Nice to meet you/);
  });

  it("rejects an empty username", async () => {
    const response = await request(app)
      .post("/new")
      .type("form")
      .send({ messageUser: "", messageText: "Hello" });

    assert.equal(response.status, 400);
    assert.match(response.text, /Username cannot be empty/);
    assert.equal(messages.length, 2);
  });

  it("rejects an empty message", async () => {
    const response = await request(app)
      .post("/new")
      .type("form")
      .send({ messageUser: "Ada", messageText: "" });

    assert.equal(response.status, 400);
    assert.match(response.text, /Message cannot be empty/);
    assert.equal(messages.length, 2);
  });
});

describe("GET /message/:id", () => {
  beforeEach(() => {
    resetMessages();
  });

  it("shows the details of a valid message", async () => {
    const response = await request(app).get("/message/0");

    assert.equal(response.status, 200);
    assert.match(response.text, /Amando/);
    assert.match(response.text, /Hi there!/);
  });

  it("rejects an invalid message id", async () => {
    for (const id of ["abc", "-1", "1.5"]) {
      const response = await request(app).get(`/message/${id}`);
      assert.equal(response.status, 400, id);
      assert.match(response.text, /Invalid message id/);
    }
  });

  it("returns 404 for an unknown message id", async () => {
    const response = await request(app).get("/message/99");

    assert.equal(response.status, 404);
    assert.match(response.text, /Message not found/);
  });
});
