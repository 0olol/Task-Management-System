// Changing this to User management
//Need to add Register here to the top of the page
//Need to Change the Names displayed to be capped
//Need to change the Names to be clickable to disable

import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import Register from "./Register";
import AdminUpdate from "./AdminUpdate";

const UserManagement = () => {
  const [username, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const [registerData, setRegisterData] = useState("");
  const [userData, setUserData] = useState("");
  const [submit, setSubmit] = useState(false)

  const [groups, setGroup] = useState("");
  const [disabling, setdisabling] = useState(false);

  const navigate = useNavigate();
  // console.log();

  useEffect(() => {
    getUsers();
    setSubmit(false);
  }, [submit]);

  // console.log(registerData);
  const userToAdmin = (userData) => {
    setUserData(userData);
    console.log(userData)
  }

  useEffect(() => {
    refreshToken();
    getUsers();
    // setRegisterData("true");
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.username);
      setExpire(decoded.exp);
      setGroup(decoded.userGroup);
      // console.log(groups)
      // console.log(groups.indexOf("admin"||"Admin"))
      // console.log(decoded.userGroup.indexOf("admin"||"Admin"))

      if(decoded.userGroup.indexOf("admin") <= -1 ){
        navigate("/update", { replace: true });
      }
      
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.username);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // console.log(groups);

  const getUsers = async () => {
    const response = await axiosJWT.get("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  return (
    <div className="columns ">
      <div className="column is-two-thirds is-centered">
        <div className="level">
          <h1>Welcome Back: {username}</h1>
          <button className="button has-text-centered" name="id" onClick={(e) => {setdisabling(!disabling); }}>Update</button>
        </div>
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Group</th>
              {disabling && <th>Button</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.username}>
                <td>{index + 1}</td>
                <td>{user.username} </td>
                <td>{user.email}</td>
                <td>{user.userGroup}</td>
                {disabling && <td><button onClick={(e) => {userToAdmin(user.username); setUserData(user.username); }} name="edit">Edit Here</button></td>}
                <td>{JSON.stringify(user.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        disabling ?  <AdminUpdate setSubmit={setSubmit} userData={userData} /> :<Register setSubmit={setSubmit}  />
      }
      
    </div>
  );
};

export default UserManagement;
