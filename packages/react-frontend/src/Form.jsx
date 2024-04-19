import React, { useState } from "react";

function Form(props) {
  const [person, setPerson] = useState({
    id: "",
    name: "",
    job: ""
  });

    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "job") {
          setPerson({...person, job: value });
        } else if (name === "id") {
          setPerson({ ...person, id: value });
        }
        else setPerson({ ...person, name: value });
    }

    function submitForm() {
        props.handleSubmit(person);
        setPerson({ id: "", name: "", job: "" });
    }
    
    return (
        <form>
          <label htmlFor="id">ID</label>
          <input
            type="text"
            name="id"
            id="id"
            value={person.id}
            onChange={handleChange}
          />
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={person.name}
            onChange={handleChange}
          />
          <label htmlFor="job">Job</label>
          <input
            type="text"
            name="job"
            id="job"
            value={person.job}
            onChange={handleChange}
          />
          <input 
            type="button" 
            value="Submit" 
            onClick={submitForm} 
          />
        </form>
      );

}

export default Form;