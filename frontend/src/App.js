import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [technology, setTechnology] = useState("");
  const [users, setUsers] = useState([]);

  const submitForm = async () => {
    await axios.post("http://localhost:5000/register", {
      name,
      email,
      technology,
    });
    fetchUsers();
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Internship Form</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Technology"
        onChange={(e) => setTechnology(e.target.value)}
      /><br/><br/>

      <button onClick={submitForm}>Submit</button>

      <h3>Users List</h3>

      <ul>
        {users.map((u, i) => (
          <li key={i}>
            {u.name} - {u.email} - {u.technology}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;