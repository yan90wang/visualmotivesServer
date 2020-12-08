import * as request from "supertest";
import app from "../src/app";
import assert = require("assert");

describe("GET /random-url", function() {
    it("should return 404", function() {
        request(app)
            .get("/blabla")
            .expect(404)
    });
});

describe("GET /clusters", function() {
    it("should return all clusters", function() {
        request(app)
            .get("/clusters")
            .expect(200)
            .then(response => {
                console.log(response)
                assert(response.size() > 1)
            })
    });
});
