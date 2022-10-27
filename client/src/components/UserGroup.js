// Creating new user group for assigning them to different user only from admin


import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import useAutoFocus from './autofocus';


 
const UserGroup = () => {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [groups, setGroups] = useState('');
    const [groupName, setGroupName] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');

    const [username, setName] = useState('');

    const [msg, setMsg] = useState('');
    const [onSubmitForm, setOnSubmitForm] = useState();
    const emailInput = useAutoFocus();
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getGroups();
    }, []);

    useEffect(() => {
        setNewGroupName('');
        getGroups();
        setOnSubmitForm(false); 
    }, [onSubmitForm]);
    

 
    const RegisterGroup = async (e) => {
          e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/userGroup', {
                groupName:newGroupName
            });
            setMsg(response.data.msg);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }


    }

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.username);
            setExpire(decoded.exp);
            setGroups(decoded.userGroup);
            if(decoded.userGroup.indexOf("admin") <= -1 ){navigate('/update',{replace:true})};
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }
 
    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.username);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getGroups = async () => {
        const response = await axiosJWT.get('http://localhost:5000/userGroup', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setGroupName(response.data);
    }


 
    return (
        <div className="columns">
            <div className="column is-centered">
            <h1>Welcome Back: {username}</h1>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>User Group</th>
                    </tr>
                </thead>
                <tbody>
                     {groupName.map((group, index) => (
                        <tr key={group.groupname}>
                        <td>{index + 1}</td>
                        <td>{group.groupName} </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className="column is-centered">
                <form onSubmit={RegisterGroup} onLoad={(e) => setOnSubmitForm(false)} className="box">
                    <p className="has-text-centered">{msg}</p>
                    <div className="field mt-5">
                        <label className="label">New User Group</label>
                        <div className="controls">
                            <input type="text" className="input" placeholder="Name" value = {newGroupName} ref={emailInput} required onChange={(e) => {if (e.code === 'Space') e.preventDefault(); setNewGroupName(e.target.value); }} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button className="button is-success is-fullwidth" onClick={()=> setOnSubmitForm(true)}>Register</button>
                    </div>
                </form>
            </div>
        </div>
                        
    )
}

export default UserGroup;




