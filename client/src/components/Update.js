// Anyone can access to update their own info

import React, { useState, useEffect, useRef, createRef } from 'react'
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
 
const Update = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [placeholderEmail, setPlaceHolderEmail] = useState('');

    const [userGroup, setuserGroup] = useState('');
    const [status, setStatus] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [onSubmitForm, setOnSubmitForm] = useState('');

    //var setValue = "";
    // const placeholderEmail = email;
    // placeholderEmail.current = email;

    const navigate = useNavigate();
 
    const Update = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/update', {
                username:username,
                email: email,
                password: password,
                confPassword: confPassword
            });
            setMsg(response.data.msg);
            navigate("/update");
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.msg)
                setMsg(error.response.data.msg);
            }
        }
    }
    useEffect(() => {
        refreshToken();
    }, [onSubmitForm]);

    useEffect(() => {
        setEmail('');
        console.log(email);
        // setPlaceHolderEmail(email);
        setPassword('');
        setConfPassword('')
        setOnSubmitForm('false');
        setPlaceHolderEmail(email);
    }, [onSubmitForm]);

    

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.username)
            setEmail(decoded.email);
            setPlaceHolderEmail(decoded.email);
            setuserGroup(decoded.userGroup);
            setStatus(decoded.status);
            setExpire(decoded.exp);
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
            // console.log(decoded.username + " interceptor");
            // setEmail(decoded.email);
            // setuserGroup(decoded.userGroup);
            // setStatus(decoded.status);
            // setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        console.log("error in update")
        return Promise.reject(error);
    });
    // console.log(userGroup);


    return (
        <div className="columns" >
            <div className="column ">
                <div className="box ">
                    <div className="title is-3">Username</div>
                    <div className="title is-4">{username}</div>
                    <div className="title is-3">Email</div>
                    <div className="title is-4">{placeholderEmail}</div>
                    <div className="title is-3">Group</div>
                    <div className="title is-4">{userGroup}</div>
                    <div className="title is-3">Status</div>
                    <div className="title is-4">{JSON.stringify(status)}</div>
                </div>

            </div>
        <div className="column">
        <form onSubmit={Update} onLoad={(e) => setOnSubmitForm(false)} className="box">
            <p className="has-text-centered">{msg}</p>
            <div className="field mt-5">
                <label className="title is-3">{username}</label>
            </div>
            <div className="field mt-5">
                <label className="label">Email</label>
                <div className="controls">
                    <input type="text" className="input" placeholder="Email" value={email}  onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div className="field mt-5">
                <label className="label">Password</label>
                <div className="controls">
                    <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="field mt-5">
                <label className="label">Confirm Password</label>
                <div className="controls">
                    <input type="password" className="input" placeholder="******"  value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                </div>
            </div>
            <div className="field mt-5">
                <button className="button is-success is-fullwidth" onClick={()=> setOnSubmitForm(true)}>Update</button>
            </div>
        </form>
        </div>
                            

    </div>
    )
}
 
export default Update