// On top of every web page
// need to change to reactive and not to have logout button when not even logged in 

import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

 
const Navbar = () => {
    const [disabling, setdisabling] = useState(false);
    const [disabling2, setdisabling2] = useState(false);

    const [token, setToken] = useState("");
    const [groups, setGroup] = useState('');
    // const [currentGroup, setcurrentGroup] = useState("");
    const navigate = useNavigate();
 
    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout');
            navigate("/");
            setdisabling(false);
            setdisabling2(false);
            sessionStorage.clear();
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() =>{
        axios.get('http://localhost:5000/token').then((response) =>{
            setdisabling(true);
            // setToken(response.data.accessToken);     
            // const decoded = jwt_decode(response.data.accessToken);
            // setGroup(decoded.userGroup);
            // console.log(groups.indexOf("admin"))
            if (sessionStorage.getItem("admin")){setdisabling2(true)}
            // else{setdisabling2(false);}
        })
        
   });

    // const refreshToken = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/token');
    //         if (response){
    //             setdisabling(true)
    //         }
    //     } catch (error) {
    //         if (error.response) {
    //             setdisabling(false)
    //         }
    //     }
    // }

    // console.log(sessionStorage.getItem("admin"))
 
    return (
        <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a className='navbar-item'>0.olol</a>
                </div>
                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                    { disabling &&
                    <>
                    {/* <a href="/mainmenu" className="navbar-item">MainMenu</a> */}
                    <a href="/update" className="navbar-item">Update</a>
                    <a href="/kanban" className="navbar-item">kanban</a>

                    </>
                    }
                    {disabling2 && 
                    <>
                    <a href="/usermanagement" className="navbar-item">User Mangement</a>
                    <a href="/usergroup" className="navbar-item">User Group</a>
                    </>
                    }
                    {/* <a href="/appget" className="navbar-item">appget</a>
                    <a href="/planget" className="navbar-item">planget</a>
                    <a href="/taskget" className="navbar-item">taskget</a> */}
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                {disabling && <button onClick={Logout}  className="button is-light">Log Out</button>}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

    )
}
 
export default Navbar