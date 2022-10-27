
import React, { useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Paper, Card,Modal  } from '@mui/material';
import TaskCard from './TaskCard'
import AppInfo from './AppInfo'
import PlanInfo from './PlanInfo'
// import nodemailer from 'nodemailer';




const KanBan = () => {
    const [appName, setAppName] = useState([]); // for the form
    const [planName, setPlanName] = useState([]); // for the form for app
    const [choosenPlanName, setChoosenPlanName] = useState([]);// for the dropdown for app

    const [choosenAppName, setChoosenAppName] = useState("defaultValue");// for the dropdown for app
    const [taskAppAcronym, setTaskAppAcronym] = useState([]); // for the form for app
    const [data, setData] = useState([]);// for the propping of data 
    const [appData, setAppData] = useState([]);// for the propping of data 
    const [planData, setPlanData] = useState([]);// for the propping of data 
    const [submit, setSubmit] = useState(false)
    const [disablingApp, setDisablingApp] = useState(false)
    const [disablingPlan, setDisablingPlan] = useState(false)


    // const addOptions = [{ value: 'defaultOption', label: 'defaultOption' }]
    

    // let state = [{"Open"},{"To Do"}, {"Doing"}, {"Doing"}, {"Close"}]
    const [state, setState] = useState([]);
  const [username, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [expire, setExpire] = useState("");
  const [open1, setOpen1] = useState(false);
  const [currentGroup, setcurrentGroup] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const openState = "open"
  const toDOState = "toDo"
  const doingState = "doing"
  const doneState = "done"
  const closeState = "close"


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);


  //   const TaskUpdate = async (e) => {
  //     e.preventDefault();
  //     try {
  //         const response = await axios.post('http://localhost:5000/taskupdate', {
  //             taskName:username,
  //             notes: password,
  //             state: confPassword,
  //             owner,
  //         });
  //         setMsg(response.data.msg);
  //         navigate("/kanban");
  //     } catch (error) {
  //         if (error.response) {
  //             console.log(error.response.data.msg)
  //             setMsg(error.response.data.msg);
  //         }
  //     }
  // }
  
    // console.log(submit)

    const getAppName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/appget", {
          });
          const data = response.data;
          setAppData(data)
          const filter = data.map((data) => data.app_acronym);
          filter.unshift("defaultValue")
          setAppName(filter);
        } catch (error) {
          console.log("appName", error);
        }
      };


    const getPlanName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/planget", {
          });
          const data = response.data;
          setPlanData(data)
          const filter = data.map((data) => data.plan_MVPName);
          filter.unshift("defaultValue")
          setPlanName(filter);
        } catch (error) {
          console.log("planName", error);
        }
      };


      const getTaskName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/taskget", {
          });
          const data = response.data;
          setData(data)
          const filter = data.map((data) => data.task_appAcronym);
          // console.log(filter)
          // filter = filter.filter(data => data.task_appAcrony== choosenAppName)
          setTaskAppAcronym(filter);
          // console.log(taskAppAcronym)
          // console.log("taskname here")
        } catch (error) {
          console.log("taskName", error);
        }
      };    

      const refreshToken = async () => {
        try {
          const response = await axios.get("http://localhost:5000/token");
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setName(decoded.username)
          // console.log(decoded.username)
          setcurrentGroup(decoded.userGroup);
          console.log(decoded.userGroup.indexOf("projectLead"));

          if (decoded.userGroup.indexOf("projectLead") > -1 ) {
            console.log(decoded.userGroup.indexOf("projectLead"))
            setDisablingApp(true);
          }
          if (decoded.userGroup.indexOf("projectManager") > -1 ) {
            console.log(decoded.userGroup.indexOf("projectManager"))
            setDisablingPlan(true);
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
            // setcurrentGroup(decoded.username);
          }
          return config;
        },
        (error) => {
          console.log("error in update");
          return Promise.reject(error);
        }
      );
    

    useEffect(() => {
      refreshToken();
        getAppName();
        getPlanName();
        getTaskName();
      }, []);

      
    useEffect(() => {
      // refreshToken();
        // getAppName();
        // getPlanName();
        getTaskName();
        setSubmit(false);
        // console.log(submit)
      }, [submit]);
 
return (
  <div >    
    <div className="columns">
    <div className="column px-0">
      <div className="box">
        <label className="label">App</label>
        {appName && (
        <Select
        id="KanBan"
        className="basic-single"
        defaultValue={{ label: "defaultValue", value: "defaultValue" }}
        options={appName.map((appName) => ({
            value: appName,
            label: appName
        }))}
        onChange={(choice) => setChoosenAppName(choice.value)}
        />)}
        <button className=" button is-fullwidth mb-2 " onClick= {(e) =>  {handleOpen();  e.stopPropagation();}}>AppInfo</button>            
        <Modal open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="has-text-centered"
        >
        <AppInfo data={appData} choosenAppName={choosenAppName} />

        </Modal>
        
      </div>
      <div className="box">
        <label className="label"> Plan</label>
        {planName && (
          <Select
          id="KanBan"
          // isMulti
          className="basic-single"
          options={planName.map((planName) => ({
              value: planName,
              label: planName
          }))}
          onChange={(choice) => setChoosenPlanName(choice.value)}
          />)}
        <button className=" button is-fullwidth mb-2 " onClick= {(e) =>  {handleOpen1();  e.stopPropagation();}}>PlanInfo</button>            
        <Modal open={open1}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="has-text-centered"
        >
        <PlanInfo data={planData} choosenPlanName={choosenPlanName} />

        </Modal>

      </div>
      {disablingApp && <a href="/appget" className="button is-fullwidth mb-2">Create/Edit App</a>}
      {disablingPlan && <a href="/planget" className="button is-fullwidth mb-2">Create/Edit Plan</a>}
      <a href="/taskget" className="button is-fullwidth mb-2">Create Task</a>
      </div>

      {/* userGroup={currentGroup} .map(data => data.app_permitOpen) */}
    <div className="column has-text-centered px-1">

    <Paper>
      <label className="label mb-0">Open</label>
      <TaskCard  data={data.filter(task=> task.task_state === openState)} choosenAppName={choosenAppName} choosenPlanName={choosenPlanName} 
      state ={openState} checkOwner={appData.filter(app => app.app_acronym == choosenAppName).map(app => app.app_permitOpen)}  
      userGroup = {currentGroup} username = {username} setSubmit={setSubmit} planData={planData.filter((data) => data.plan_appAcronym ==choosenAppName).map((data) => data.plan_MVPName)}/>
    </Paper>
    </div>
    
    
    
    <div className="column has-text-centered px-1">
    <Paper>
      <label className="label mb-0">To Do</label>
      <TaskCard  data={data.filter(task=> task.task_state === toDOState)} choosenAppName={choosenAppName} choosenPlanName={choosenPlanName} 
      state ={toDOState} checkOwner={appData.filter(app => app.app_acronym == choosenAppName ).map(app => app.app_permitToDo)} 
      userGroup = {currentGroup} username = {username} setSubmit={setSubmit}/>
    </Paper> 
    </div>
    
    
    <div className="column has-text-centered px-1">
    <Paper>
      <label className="label mb-0">Doing</label>
      <TaskCard  data={data.filter(task=> task.task_state === doingState)} choosenAppName={choosenAppName} choosenPlanName={choosenPlanName} 
      state ={doingState} checkOwner={appData.filter(app => app.app_acronym == choosenAppName).map(app => app.app_permitDoing)}
      userGroup = {currentGroup} username = {username} setSubmit={setSubmit}/>
    </Paper>
    </div>


    <div className="column has-text-centered px-1">
    <Paper>
      <label className="label mb-0">Done</label>
      <TaskCard  data={data.filter(task=> task.task_state === doneState)} choosenAppName={choosenAppName} choosenPlanName={choosenPlanName} 
      state ={doneState} checkOwner={appData.filter(app => app.app_acronym == choosenAppName).map(app => app.app_permitDone)} 
      userGroup = {currentGroup} username = {username} setSubmit={setSubmit} planData={planData.filter((data) => data.plan_appAcronym ==choosenAppName).map((data) => data.plan_MVPName)}/>
    </Paper>
    </div>
    
    
    
    <div className="column has-text-centered  px-1">
    <Paper>
      <label className="label mb-0">Close</label>
      <TaskCard  data={data.filter(task=> task.task_state === closeState)} choosenAppName={choosenAppName} choosenPlanName={choosenPlanName} state ={closeState} userGroup = {currentGroup} />
    </Paper>
    </div>
    </div>
  </div>


)
}

export default KanBan



      // {/* {state.map((task) =>(
      //   <Paper key={task.state}>
      //   <label className="label mb-0">{task.state}</label>
      //   </Paper>
      // ))
      // } */}