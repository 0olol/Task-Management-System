//useless, not using already.
// checkgroup to be updated.
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom';



const Mainmenu = () => {

    const [username, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [groups, setGroup] = useState('');

    const navigate = useNavigate();
    
    useEffect(() => {
        refreshToken();
    }, []);


 
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.username);
            setExpire(decoded.exp);
            // checkGroup(decoded.username);
            setGroup(decoded.userGroup);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }


    // const checkGroup = async (username) => {
    //     if(username != null){
    //         // console.log(username);
    //         // console.log(groups);
    //         // console.log("i fire checkgroup once");
    //     try{
    //         const response = await axios.get('http://localhost:5000/groups' , {
    //             headers:{
    //                 username: username
    //             }
    //         })
    //         // console.log(username);
    //         // console.log("response check group");
    //         // console.log(response.data );
    //         // setcheckUserGroup(response.data);
    //         // console.log("hello");
    //         // if (checkUserGroup == "admin"){
    //         //     navigate("/mainmenu");
    //         // }
    //     } catch (error) {
    //         if (error.response) {
    //             console.log(error.response);
    //         }
    //     }
    // }
    // }
    

    // const axiosJWT = axios.create();
 
    // axiosJWT.interceptors.request.use(async (config) => {
    //     const currentDate = new Date();
    //     if (expire * 1000 < currentDate.getTime()) {
    //         const response = await axios.get('http://localhost:5000/token');
    //         config.headers.Authorization = `Bearer ${response.data.accessToken}`;
    //         setToken(response.data.accessToken);
    //         const decoded = jwt_decode(response.data.accessToken);
    //         setName(decoded.username);
    //         setExpire(decoded.exp);
    //     }
    //     return config;
    // }, (error) => {
    //     return Promise.reject(error);
    // });


    // console.log(groups);
    // console.log(groups.indexOf("admin"||"Admin"))
    const handleOnClick = () => {
        if (groups.indexOf("admin") >= 0){
            navigate('/usermanagement', {reaplce:true});
        }
        else{
            navigate('/update',{replace:true});
        }
    }
    // console.log(sessionStorage.getItem("admin"))

    const handleOnClick1 =() =>{
        navigate('/kanban', {reaplce:true});

    }
    
    return (
        <div className="container is-centered">
            <h1>Welcome Back: {username}</h1>
            <button className = "button" onClick={handleOnClick}> User Management</button>
            <button className = "button" onClick={handleOnClick1}>Kanban</button>
        </div>
    )}

    export default Mainmenu