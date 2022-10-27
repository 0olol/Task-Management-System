//Need to change this to show it with admin rights 
// Probably moving this to top of Dashboard(User Management)
// autofocus problem


import React, { useState, useEffect } from 'react'
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import useAutoFocus from './autofocus';
// import Dashboard, {getUsers, refreshToken} from "./Dashboard";

 
const Register =(props) => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    // const [onSubmitForm, props.setSubmit] = useState('');
    const emailInput = useAutoFocus();
 
    const Register = async (e) => {
          e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/users', {
                username: username,
                email: email,
                password: password,
                confPassword: confPassword
            });
            setMsg(response.data.msg);
            props.setSubmit(true)
            setName('');
            setEmail('');
            setPassword('');
            setConfPassword(''); 
            
            // window.location.reload(true);
            //navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
 
    return (
        // <div className="columns">
        //     <Dashboard />
                        <div className="column" >
                            <form onSubmit={Register} onLoad={(e) => props.setSubmit(false)} className="box">
                                <p className="has-text-centered">{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Register New User's Name</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Name" value={username} ref={emailInput} required onChange={(e) => {if (e.code === 'Space') e.preventDefault(); setName(e.target.value); }} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input pattern="/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/" type="text" className="input" placeholder="Email" value={email} onChange={(e) => {if (e.code === 'Space') e.preventDefault(); setEmail(e.target.value)}} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={password} required onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={confPassword} required onChange={(e) => setConfPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth" onClick={(e)=> {props.setSubmit(true); e.stopPropagation();}}>Register</button>
                                </div>
                            </form>
                        </div>
    // </div>
    )
}
 
// export {onSubmitForm}
export default Register