import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

//components
import TodoCreate from "./todolist/Create";
import TodoList from "./todolist/List";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const [todosChange, setTodosChange] = useState(false);

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { jwt_token: localStorage.jwt_token }
      });

      const parseData = await res.json();
      setName(parseData.name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwt_token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  const getSearchResult = async e => {
    e.preventDefault();
    
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("jwt_token", localStorage.jwt_token);

      const response = await fetch(`http://localhost:5000/dashboard/todos/search?description=${description}`, {
        method: "GET",
        headers: myHeaders
      });

      const jsonData = await response.json();
      setAllTodos(jsonData);
      setDescription("")
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/todos",{
        method: "GET",
        headers: { jwt_token: localStorage.jwt_token }
      });
      const jsonData = await response.json();

      setAllTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    getTodos();
    setTodosChange(false);
  }, [todosChange]);

  return (
    <div>
      <div className="d-flex mt-5">
        <h2>{name} 's Todo List</h2>
        <button onClick={e => logout(e)} className="btn btn-primary" style={{position: "absolute",right: "8rem"}}>
          Logout
        </button>
      </div>
      <form className="d-flex mt-5" onSubmit={getSearchResult}>
        <input
          type="text"
          className="form-control"
          value={description}
          placeholder="Search Todo..."
          onChange={e => setDescription(e.target.value)}
        />
        <button className="btn btn-success">Search</button>
      </form>
      <TodoCreate setTodosChange={setTodosChange} />
      <TodoList allTodos={allTodos} setTodosChange={setTodosChange} />
    </div>
  );
};

export default Dashboard;