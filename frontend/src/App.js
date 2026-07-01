import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [technology, setTechnology] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/users/${editingId}`,
          {
            name,
            email,
            technology,
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/register",
          {
            name,
            email,
            technology,
          }
        );
      }

      setName("");
      setEmail("");
      setTechnology("");
      setEditingId(null);

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setTechnology(user.technology);
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Internship Management System</h1>

      <div className="form-box">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Technology"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update User" : "Add User"}
        </button>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search by Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Registered Interns</h2>

      {filteredUsers.map((user) => (
        <div className="card" key={user._id}>
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Technology:</strong> {user.technology}
          </p>

          <button
            className="edit-btn"
            onClick={() => handleEdit(user)}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => handleDelete(user._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;