const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
let firstTodo, newTodoId;

describe(`${endpointUrl}`, () => {
    it("can do a POST", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body;
    });

    it("can do a GET", async () => {
        const response = await request(app)
            .get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });

    it("can GET by ID", async () => {
        const response = await request(app)
            .get(endpointUrl + firstTodo._id );
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    })

    it("can GET by ID when doesn't exist", async () => {
        const response = await request(app)
            .get(endpointUrl + "61cdd30b1b82fc8b029e8d8c" );
        expect(response.statusCode).toBe(404);
    })

    it("errors properly when malformed data on post", async () => {
        const response = await request(app).post(endpointUrl).send({title:"Missing done property"});
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toStrictEqual( "Todo validation failed: done: Path `done` is required.");
    });

    it("can return 404 on phony put", async () => {
        const response = await request(app)
            .put(endpointUrl + "61cdd30b1b82fc8b029e8d8c" );
        expect(response.statusCode).toBe(404);
    });

    it("can return update a todo with PUT", async () => {
        const testData = { title: "Make tests great again", done : true};

        const response = await request(app)
            .put(endpointUrl + newTodoId._id ).send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toStrictEqual(testData.title);
        expect(response.body.done).toStrictEqual(testData.done);
    });

    it("can delete a todo with DELETE", async () => {
        const response = await request(app)
            .delete(endpointUrl + firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });
})