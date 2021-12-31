const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();
jest.mock("../../model/todo.model");

let req, res, next;

const todoId = "61cdd30b1b82fc8b029e8d8c";
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

describe("TodoController.deleteTodo", () => {
    it("should have a deleteTodo function", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    });

    it("should call TodoModel.findByIdAndDelete", async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req,res,next);
        expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
    });

    it("should return JSON body and resp code 200", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should error when problems arise", async () => {
        const errorMsg = {message: "Generic error message"};
        const reject = Promise.reject(errorMsg);
        TodoModel.findByIdAndDelete.mockReturnValue(reject);
        await TodoController.deleteTodo(req,res,next);
        expect(next).toBeCalledWith(errorMsg);
    })

    it("should 404 when file not found", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe("TodoController.updateTodo", () => {

    it("should have a updateTodo function", () => {
        expect(typeof TodoController.updateTodo).toBe("function");
    });

    it("should call TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req,res,next);
        expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {new: true, useFindAndModify: false});
    });

    it("should return JSON body and response code 200", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })

    it("should error when item cannot be found", async () => {
        const errorMsg = {message: "No item found for that id"};
        const reject = Promise.reject(errorMsg);
        TodoModel.findByIdAndUpdate.mockReturnValue(reject);

        await TodoController.updateTodo(req,res,next);
        expect(next).toBeCalledWith(errorMsg);
    });

    it("should handle 404", async ()=> {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req,res,next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    })

});

describe("TodoController.getTodoById", () => {
    it("should have a getTodoById function", async () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });

    it("should call TodoModel.findById with route parameters", async () => {
        req.params.todoId = todoId;
        await TodoController.getTodoById(req,res,next);
        expect(TodoModel.findById).toBeCalledWith("61cdd30b1b82fc8b029e8d8c");
    });

    it("should return JSON body and response code 200", async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    
    it("should return an error on exception", async () => {
        const errorMsg = { message: "Big bang"};
        const rejectedPromise = Promise.reject(errorMsg);
        TodoModel.findById.mockReturnValue(rejectedPromise);

        await TodoController.getTodoById(req,res,next);
        expect(next).toHaveBeenCalledWith(errorMsg);
    })

    it("should return 404 if item doesn't exist", async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy;
    })
})

describe("TodoController.getTodos", () => {
    it("should have a getTodos function", async () => {
        expect(typeof TodoController.getTodos).toBe("function");
    });

    it("should call TodoModel.find()", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });

    it("should return with status 200 and all the todos", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });

    it("should return an error on exception", async () => {
        const errorMessage = { message: "Unexpected Error" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
})


describe("TodoController.createTodo", () => {

    beforeEach(() => {
        req.body = newTodo;
    })

    it("should have a createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });


    it("should call TodoModel.create", () => {
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });

    it("should return 201 response code", async () => {
        req.body = newTodo;
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body in response", async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);

    })

    it("should handle errors correctly", async () => {
        const errorMessage = { message: "done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);

        expect(next).toBeCalledWith(errorMessage);

    })


})