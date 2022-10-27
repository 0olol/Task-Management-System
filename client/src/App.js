import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react'
import UserManagement from "./components/UserManagement";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Mainmenu from "./components/Mainmenu";
import Update from "./components/Update";
import UserGroup from "./components/UserGroup";

import Register from "./components/Register";
import AdminUpdate from "./components/AdminUpdate";
import axios from 'axios';
import AppGet from "./components/AppGet";
import PlanGet from "./components/PlanGet";
import TaskGet from "./components/TaskGet";
import KanBan from "./components/KanBan";





 
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
      

        <Route path="/" element = {<Login />} />
        {/* <Route path="/mainmenu" element = {<Mainmenu />} /> */}
        <Route path="/update" element = {<Update />} />
        <Route path ="/usermanagement" element ={<UserManagement/>} />
        <Route path ="/usergroup" element ={<UserGroup/>} />
        {/* <Route path ="/adminupdate" element ={<AdminUpdate/>} /> */}
        <Route path ="/appget" element ={<AppGet/>} />
        <Route path ="/planget" element ={<PlanGet/>} />
        <Route path ="/taskget" element ={<TaskGet/>} />
        <Route path ="/kanban" element ={<KanBan/>} />


      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
