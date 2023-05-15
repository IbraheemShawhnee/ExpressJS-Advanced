import express from "express";
import { json } from "express";
import { todos } from "./dummyTodos.js";

const app = express();
const port = 3000;

app.use(json());
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

app.get("/todos", (req, res) => res.status(200).send(todos));

const IDExists = (req, res, next) => {
	const id = JSON.parse(req.params.id);
	const todo = todos.find((todo) => todo.id == id);
	if (!todo) {
		res.status(404).send("You Don't Have this todo.. ");
	}
	next();
};

app.get("/todos/:id", IDExists, (req, res) => {
	const id = JSON.parse(req.params.id);
	const todo = todos.find((todo) => todo.id == id);
	res.status(200).send(todo);
});

app.delete("/todos/:id", IDExists, (req, res) => {
	if (todos.length == 0) {
		res.status(422).send("Empty!");
	}
	const id = JSON.parse(req.params.id);
	let updatedTodos = JSON.stringify(todoDeleteHandler(id));
	let response = `Todo with id: ${id} has been deleted.`;
	res.status(200).send(response);
});

const validateTask = (req, res, next) => {
	const { title, description } = req.body;
	if (!title || !description) {
		return res.status(400).send("Title and description are required");
	}
	next();
};

app.use(validateTask);

app.post("/todos", (req, res) => {
	const { title, description } = req.body;
	const id = todos.length + 1;
	const newTodo = { id, title, description, completionStatus: false };
	todos.push(newTodo);
	res.send(`Created a new todo with ID of ${id}`);
});

app.put("/todos/:id", IDExists, (req, res) => {
	const id = JSON.parse(req.params.id);
	const { title, description, completionStatus } = req.body;
	const todo = todos.find((todo) => todo.id === id);
	todo.title = title || todo.title;
	todo.completionStatus = completionStatus || todo.completionStatus;
	todo.description = description || todo.description;
	res.send(`Todo with ID ${id} was Updated`);
});

const todoDeleteHandler = (id) => {
	todos = todos.filter((todo) => todo.id != id);
	return todos;
};

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
