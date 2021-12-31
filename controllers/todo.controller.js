const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
    try {
        const createdModel = await TodoModel.create(req.body);
        res.status(201).json(createdModel);
    } catch (err) {
        next(err);
        // not this         res.status(500).json(err);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        const allTodos = await TodoModel.find({});
        res.status(200).json(allTodos);
    } catch (err) {
        next(err);
    }
};

exports.getTodoById = async (req, res, next) => {
    try {
        const todo = await TodoModel.findById(req.params.todoId);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateTodo = async (req, res, next) => {
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, { new: true, useFindAndModify: false });

        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).json(updatedTodo);
        }

    } catch (err) {
        next(err)
    }
}

exports.deleteTodo = async (req, res, next) => {
    try {
        const todo = await TodoModel.findByIdAndDelete(req.params.todoId);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};