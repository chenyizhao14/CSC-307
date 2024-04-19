import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
	users_list: [
	{
		id: "xyz789",
		name: "Charlie",
		job: "Janitor"
	},
	{
		id: "abc123",
		name: "Mac",
		job: "Bouncer"
	},
	{
		id: "ppp222",
		name: "Mac",
		job: "Professor"
	},
	{
		id: "yat999",
		name: "Dee",
		job: "Aspring actress"
	},
	{
		id: "zap555",
		name: "Dennis",
		job: "Bartender"
	},
	]
};

const addUser = (user) => {
	users["users_list"].push(user);
	return user;
};

// const findUserByName = (name) => {
// 	return users["users_list"].filter(
// 	(user) => user["name"] === name
// 	);
// };

// const findUserByJob = (job) => {
// 	return users["users_list"].filter(
// 	(user) => (user.job === job));
// };

const findUserByNameJob = (name, job) => {
	return users["users_list"].filter(
		(user) => (user.name === name && user.job === job)
		);
	}

const findUserById = (id) =>
	users["users_list"].find((user) => user["id"] === id);

// generate ID on server
const generateId = () => {
	const chars = "abcdefghijklmnopqrstuvwxyz";
	let result = "";
	for (let i = 0; i < 3; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	let num = Math.floor(Math.random() * 1000).toString();
	result += num;
	return result;
}


app.listen(port, () => {
	console.log(
	`Example app listening at http://localhost:${port}`
	);
});

app.use(cors());
app.use(express.json());

app.get("/users/:id", (req, res) => {
	const id = req.params["id"]; //or req.params.id
	let result = findUserById(id);
	if (result === undefined) {
		res.status(404).send("Resource not found.");
	} else {
		res.send(result);
	}
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});


app.get("/users", (req, res) => {
	const {name,job} = req.query;
	if (name != undefined && job != undefined) {
		let result = findUserByNameJob(name, job);
		result = { users_list: result };
		res.send(result);
	} else {
		res.send(users);
	}
});

app.post("/users", (req, res) => {
	const userToAdd = req.body;
	if ("id" in userToAdd) {
		addUser(userToAdd);
	} else {
		userToAdd.id = generateId();
		addUser(userToAdd);
	}

	// just added this line for 201 requirement
	// and the additional returning the updated representation
	res.status(201).send(userToAdd);
});


const findUserIndexById = (id) =>
  users.users_list.findIndex(user => user.id === id);

  
  app.delete("/users/:id", (req, res) => {
	const id = req.params.id;
	const index = findUserIndexById(id);
	if (index !== -1) {
	  users.users_list.splice(index, 1);
	  res.sendStatus(204); // Successful deletion, no content to return
	} else {
	  res.sendStatus(404); // Resource not found
	}
  });

// app.delete("/users/:id", (req, res) => {
// 	const id = req.params.id;
// 	const index = findUserIndexById(id);
// 	if (index !== -1) {
// 		const updatedUsersList = users.users_list.filter(user => user.id !== id);
// 		users.users_list = updatedUsersList;
// 		res.status(204).send("User deleted successfully");
//   } else {
// 	  res.status(404).send("User not found");
//   }
// });
