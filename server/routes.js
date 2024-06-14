const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

// Return the collection we want to work with
const getCollection = () => {
    const client = getConnectedClient();
    
    // MongoDB Tables = "Collections", each object is a document
    const collection = client.db("todosdb").collection("todos");
    
    return collection;
};

// GET /todos
router.get("/todos", async (request, response) => {
    const collection = getCollection();
    
    const todos = await collection.find({}).toArray(); // bring back all todos with an empty array
    
    response.status(200).json(todos);
});

// POST /todos
router.post("/todos", async (request, response) => {
    const collection = getCollection();
    let { todo } = request.body;

    // check
    if (!todo) {
        return response.status(400).json({ mssg: "error no todo found" });
    }

    todo = (typeof todo === "string") ? todo: JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false });
    
    response.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id
router.delete("/todos/:id", async (request, response) => {
    const collection = getCollection();
    const _id = new ObjectId(request.params.id);

    const deletedTodo = await collection.deleteOne({ _id });

    response.status(200).json(deletedTodo); 
});

// PUT /todos/:id
router.put("/todos/:id", async (request, response) => {
    const collection = getCollection();
    const _id = new ObjectId(request.params.id);
    const { status } = request.body;

    // check it's a boolean
    if (typeof status !== "boolean") {
        return response.status(400).json({ mssg: "invalid status" });
    }

    const updatedTodo = await collection.updateOne({ _id }, {$set: {status: !status } });
    
    response.status(200).json(updatedTodo); 
});

module.exports = router;
