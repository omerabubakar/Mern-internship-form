import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [technology, setTechnology] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const handleLogin = () => {
    if (
      loginEmail === "admin@gmail.com" &&
      loginPassword === "12345"
    ) {
      setLoggedIn(true);
    } else {
      alert("Invalid Email or Password");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchUsers();
    }
  }, [loggedIn]);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!name || !email || !technology) {
      setError("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

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

        setMessage("User Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/register",
          {
            name,
            email,
            technology,
          }
        );

        setMessage("User Added Successfully");
      }

      setName("");
      setEmail("");
      setTechnology("");
      setEditingId(null);

      fetchUsers();
    } catch (error) {
      setError("Operation Failed");
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

      setMessage("User Deleted Successfully");

      fetchUsers();
    } catch (error) {
      setError("Delete Failed");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      user.technology === filter;

    return matchesSearch && matchesFilter;
  });

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;

  const currentUsers = filteredUsers.slice(
    firstIndex,
    lastIndex
  );

  if (!loggedIn) {
    return (
      <div className="login-box">
        <h1>Internship System Login</h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setLoginEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setLoginPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p>
          Email: admin@gmail.com
          <br />
          Password: 12345
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Advanced Internship Management System</h1>

      {message && (
        <p className="success">{message}</p>
      )}

      {error && (
        <p className="error">{error}</p>
      )}

      <div className="form-box">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Technology"
          value={technology}
          onChange={(e) =>
            setTechnology(e.target.value)
          }
        />

        <button onClick={handleSubmit}>
          {editingId
            ? "Update User"
            : "Add User"}
        </button>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search by Name"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
      >
        <option value="All">All</option>
        <option value="React">React</option>
        <option value="Node.js">Node.js</option>
        <option value="MongoDB">MongoDB</option>
      </select>

      <h2>Registered Interns</h2>

      {currentUsers.map((user) => (
        <div className="card" key={user._id}>
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Technology:</strong>{" "}
            {user.technology}
          </p>

          <button
            className="edit-btn"
            onClick={() => handleEdit(user)}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() =>
              handleDelete(user._id)
            }
          >
            Delete
          </button>
        </div>
      ))}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
        >
          Previous
        </button>

        <button
          disabled={
            lastIndex >= filteredUsers.length
          }
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;