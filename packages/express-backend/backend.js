import express from "express";
import cors from "cors";
import Users from "./user-services.js";
import userModel from "./user.js";

const app = express();
const port = 8000;

// const addUser = (user) => {
// 	users["users_list"].push(user);
// 	return user;
// };

// const findUserByName = (name) => {
// 	return users["users_list"].filter(
// 	(user) => user["name"] === name
// 	);
// };

// const findUserByJob = (job) => {
// 	return users["users_list"].filter(
// 	(user) => (user.job === job));
// };


// const findUserById = (id) =>
// 	users["users_list"].find((user) => user["id"] === id);

// generate ID on server
// const generateId = () => {
// 	const chars = "abcdefghijklmnopqrstuvwxyz";
// 	let result = "";
// 	for (let i = 0; i < 3; i++) {
// 		result += chars.charAt(Math.floor(Math.random() * chars.length));
// 	}
// 	let num = Math.floor(Math.random() * 1000).toString();
// 	result += num;
// 	return result;
// }

// console.log() for frontend is where the web browser is

app.listen(port, () => {
	console.log(
	`Example app listening at http://localhost:${port}`
	);
});

app.use(cors());
app.use(express.json());

app.get("/users/:id", (req, res) => {
	const id = req.params["id"]; //or req.params.id
	Users.findUserById(id)
		.then(result => {
			if (result === undefined) {
				res.status(404).send("Resource not found.");
			} else {
				res.send(result);
			}
		})
		.catch(error => {
			res.status(500).send("Server error" + error);
		});
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});


app.get("/users", (req, res) => {
	const {name,job} = req.query;
	if (job !== undefined &&  name !== undefined ) {
		let query = { name: name, job: job };
		userModel.find(query)
			.then(result => {
				res.send({result});
			})
			.catch(error => {
				res.status(500).send("Error in server " + error);
		});
	} else if (name !== undefined ){
		Users.getUsers(name)
			.then(result => {
				res.send({result});
			})
			.catch(error => {
				res.status(500).send("Error in name search " + error);
			});
	} else if (job !== undefined) {
		Users.getUsers(null, job)
			.then (result => {
				res.send({result});
			})
			.catch(err => {
				res.status(500).send('Error in job search '+ err );
	});
		// promise = userModel.find()
		// Users.getUsers(name, job)
		// 	.then(result => {
		// 		res.send({result});
		// 	})
		// 	.catch(error =>{
		// 		console.log(error);
		// 	});
	} else {
		Users.getUsers()
			.then(result => {
				res.send(result);
			})
			.catch(error =>{
				res.status(500).send("Error in fetching all users:" + error);
			})
		}
});

app.post("/users", (req, res) => {
	const userToAdd = req.body;
	Users.addUser(userToAdd)
		.then((newUser) => {
			const responseUser = {...userToAdd, _id: newUser._id};
			res.status(201).send(responseUser);
			})
			.catch((err) => {
				res.status(500).send("Server Error" + err)
			});
});
  
  app.delete("/users/:id", (req, res) => {
	const id = req.params.id;
	userModel.findByIdAndDelete(id)
		.then(result => {
			res.status(204).send("Deleted User");
		})
		.catch( error =>{
			res.status(400).send(`cannot delete the user with the id ${id}`);
		});
  });

