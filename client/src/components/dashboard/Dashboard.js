import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

//components
import TodoCreate from "./todolist/Create";
import TodoList from "./todolist/List";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

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

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <div className="d-flex mt-5">
        <h2>{name} 's Todo List</h2>
        <button onClick={e => logout(e)} className="btn btn-primary" style={{position: "absolute",right: "8rem"}}>
          Logout
        </button>
      </div>
      <TodoCreate />
      <TodoList />
    </div>
  );
};

export default Dashboard;