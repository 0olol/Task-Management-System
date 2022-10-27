//Login Page

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [groups, setGroup] = useState('');

    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/login', {
                username: username,
                password: password
            });
            checkGroup(username, "admin");
            navigate("/kanban");
        } catch (error) {
            if (error.response) {
                setMsg("Wrong Username or Password");
            }
        }
    }

    const checkGroup = async (username,groups) => {
        await axios.get('http://localhost:5000/groups' , {
                headers:{
                    username: username
                }
        }).then(groups =>{
            console.log(groups.data)
            if(groups.data===true){sessionStorage.setItem("admin",true)}            
            })
        .catch (error => { if (error.response) {
            console.log("hello")
            console.log(error.res.response);
        }}) 
            
        
    }
    

    useEffect(() =>{
         refreshToken();
    }, [])


    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            if (response){
                navigate("/kanban");
            }
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }
 
    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Auth} className="box">
                                <p className="has-text-centered">{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Username</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Username" value={username} required onChange={(e) => setUsername(e.target.value) } />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
 
export default Login