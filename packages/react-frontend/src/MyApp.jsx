// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  
  // function fetchUsers() {
  //   const promise = fetch("http://localhost:8000/users")
  //     .then((json) => setCharacters(json.users_list))
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //     return promise;
  // }

  function fetchUsers() {
    return fetch("http://localhost:8000/users")
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid response data");
        }
        return data;
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        throw error;
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((usersList) => {
        setCharacters(usersList);
      })
      .catch((error) => {
        console.error("Error setting characters:", error);
      });
  }, []);

  // useEffect(() => {
  //   fetchUsers()
  //     .then((res) => res.json())
  //     .then((json) => setCharacters(json["users_list"]))
  //     .catch((error) => { console.log(error); });
  // }, [] );


  function removeOneCharacter(_id) {
    fetch(`http://localhost:8000/users/${_id}`, {
      method: "DELETE"
    })
    .then((res) => {
      if (res.status === 204) {
        // Successful deletion, update frontend
        setCharacters(characters.filter(character => character._id !== _id));
      } else if (res.status === 404) {
        // Resource not found, handle error if needed
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  // function updateList(person) { 
  //   postUser(person)
  //     .then(() => {
  //       setCharacters(prevCharacters => [...prevCharacters, person]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }
  
  function updateList(person) { 
    postUser(person)
      .then(response => response.json()) // Parse the response body as JSON
      .then(newUser => {
        // Update characters state with the new user including its _id
        setCharacters(prevCharacters => [...prevCharacters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table 
        characterData={characters} 
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
  
}

export default MyApp;