// Only admin verified can enter to disable account status or edit their status
// Copied from update page

import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";

const AdminUpdate = (props) => {
  const [username, setName] = useState(props.userData);
  const [email, setEmail] = useState("");
  const [placeholderEmail, setPlaceHolderEmail] = useState("");

  const [groupName, setGroupName] = useState([]); // for the form
  const [currentGroup, setcurrentGroup] = useState("");
  const [defaultValue, setDefaultValue] = useState([]);
  const [userGroup, setuserGroup] = useState([]);// for the dropdown
  const [status, setStatus] = useState(true);
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  // const [onSubmitForm, setSubmit] = useState("");
  const [option, setOption] = useState([]);
  const navigate = useNavigate();


  // this is the most impt part
  const AdminUpdate = async (e) => {
    e.preventDefault();
    // console.log(username)
    // console.log(password)
    try {
      const response = await axios.post("http://localhost:5000/adminupdate", {
        username: username,
        email: email,
        password: password,
        confPassword: confPassword,
        userGroup:userGroup.toString(),
        status:status
      });
      setMsg(response.data.msg);
      props.setSubmit(true)
      setEmail(email);
      setPassword('');
      setConfPassword(''); 
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
        setMsg(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    refreshToken();
    getGroups();
    // adminGetInfo();
    setName(props.userData);
  }, [props.userData]);

  useEffect(() => {
     axios.get("http://localhost:5000/adminupdate",{
        headers: {
          username: username,
      }}).then((response) =>{
          setEmail(response.data.email);
          console.log(email);
          setStatus(response.data.status);
          setuserGroup(response.data.userGroup.split(","));
      })
  }
  , [username]);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setcurrentGroup(decoded.userGroup);
      
      if (decoded.userGroup.indexOf("admin") <= -1 ) {
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
        setcurrentGroup(decoded.username);
        // console.log(decoded.username)
      }
      return config;
    },
    (error) => {
      console.log("error in update");
      return Promise.reject(error);
    }
  );

  const getGroups = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/userGroup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      const filter = data.map((data) => data.groupName);
      setGroupName(filter);
    } catch (error) {
      console.log("groupname", error);
    }
  };

  // Not using but placing it just in case,using this in the useeffect part 
  // const adminGetInfo = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/adminupdate", {
  //       headers: {
  //         username: username,
  //       },
  //     });
  //   setEmail(response.data.email)
  //   setStatus(response.data.status)
  //   setuserGroup(response.data.userGroup)
  //   setDefaultValue(response.data.userGroup.split(",") .map((groupName) =>({
  //     value:groupName,
  //     label:groupName
  //   }))) 
  //   // .map((groupName) =>({
  //   //   value:groupName,
  //   //   label:groupName
  //   // }))
  //   // // console.log(response.data.userGroup.split(","))
  //   // defaultValue = response.data.userGroup.map((userGroup) =>({
  //   //   value:userGroup,
  //   //   label:userGroup
  //   // }))
  //   console.log(defaultValue);
  //   // setDefaultValue(defaultValue)

  //   } catch (error) {
  //     if (error.response) {
  //       console.log(error.response);
  //     }
  //   }
  // };

  const handleChange = (e) => {
    setuserGroup( e.map((e)=> e.value))
  }

  // const handleClick = (e) => {
  //   e.forceUpdate();
  // }
// console.log(username)
// console.log(email);
//console.log(defaultValue)

  return (
    <div className="column">
      <form onSubmit={AdminUpdate} onLoad={(e) => props.setSubmit(false)} className="box" >
        <p className="has-text-centered">{msg}</p>
        <div className="field mt-5">
          <label className="title is-5">{username}</label>
        </div>
        <div className="field mt-5">
          <label className="label">Email</label>
          <div className="controls">
            <input
              type="text"
              className="input"
              autoFocus
              value={email}
              placeholder="Email"
              onChange={(e) => {
                if (e.code === "Space") e.preventDefault();
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="field mt-5">
          <label className="label">Password</label>
          <div className="controls">
            <input
              type="password"
              className="input"
              value={password}
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="field mt-5">
          <label className="label">Confirm Password</label>
          <div className="controls">
            <input
              type="password"
              className="input"
              value={confPassword}
              placeholder="******"
              onChange={(e) => setConfPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="columns">
          <div className="column is-two-thirds is-centered">
          {groupName && (
            
            <Select
              id="AdminUpdate"
              // defaultValue={defaultValue.map((defaultValue)=> ({
              //   value: defaultValue,
              //   label:defaultValue
              // }))}
              value={userGroup.map((userGroup)=> ({
                value: userGroup,
                label:userGroup
              }))}
              isMulti
              className="basic-multi-select"
              options={groupName.map((groupName) => ({
                value: groupName,
                label: groupName
              }))}
              onChange={handleChange}
              
            />
          )}
          </div>
          

          <div className="column ">
            <div>Enabled ?</div>
            <label className="radio">
              <input
                type="radio"
                name="status"
                checked={status}
                onChange={(e) => setStatus(true)}
              />
              Yes
            </label>
            <label className="radio">
              <input
                type="radio"
                name="status"
                checked={!status}
                onChange={(e) => setStatus(false)}
              />
              No
            </label>
          </div>
        </div>

        <div className="field mt-5">
          <button className="button is-success is-fullwidth" onClick={(e) =>  {console.log(props); props.setSubmit(true);  e.stopPropagation();}} >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdate;
