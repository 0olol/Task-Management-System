// setData over here is to count the number of times the data appear, can be used elsewhere

import React, { useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

 
const RegisterTask =() => {
    var date = new Date()
    
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [owner, setOwner] = useState(''); // user name 
    const [id, setId] = useState('');
    const [disablingButton, setDisablingButton] = useState(true);
    // const [acronName, setAcronName] = useState('');
    // const [state, setState] = useState('');
    // const [creator, setCreator] = useState('');
    // const [createDate, setCreateDate] = useState(new Date().toISOString().split("T")[0]);
    // const [count, setCount] = useState()

    const [data, setData] = useState([]);// for the reversing of the names with id
    
    const [choosenAppName, setChoosenAppName] = useState([]);// for the dropdown for app
    const [appName, setAppName] = useState([]); // for the form for app
    const [choosenPlanName, setChoosenPlanName] = useState([]);// for the dropdown for app
    const [planName, setPlanName] = useState([]); // for the form for app
    const [planAppName, setPlanAppName] = useState([]); // for the form for app

    const [taskAppAcronym, setTaskAppAcronym] = useState([]); // for the form for app

    // const [username, setName] = useState("");
    const [checkPermitCreate, setCheckPermitCreate] = useState("");
    const [expire, setExpire] = useState("");
    const [open1, setOpen1] = useState(false);
    const [currentGroup, setcurrentGroup] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');
    const [submit,setSubmit] = useState('');



    // const emailInput = useAutoFocus(); ref={emailInput}
 
    const RegisterTask = async (e) => {
          e.preventDefault();
          if(!choosenAppName.length){
            // console.log("hello")
            return setMsg("Choose Which App you want.")
          }
        try {
            const response = await axios.post('http://localhost:5000/taskget', {
                taskName: taskName,
                description: description,
                // notes: notes,
                // id: id,
                plan:choosenPlanName.toString(),
                owner:owner,
                acronName:choosenAppName.toString(),
                creator:currentGroup
                 // state:state,
                // createDate:createDate
            });
            setMsg(response.data.msg);
            setTaskName("")
            setDescription("")
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } 
      } 
      // finally{

      // }
    }

    const getAppName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/appget", {
          });
          const data = response.data;
          setData(data);
          const filterName = data.map((data) => data.app_acronym);
          // console.log(filterName)
          setAppName(filterName);
        } catch (error) {
          console.log("appName", error);
        }
      };

    const getPlanName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/planget", {
          });
          const data = response.data;
        // const filter = data.map((data) => data.plan_MVPName);
          // console.log(filter)
          setPlanName(data);
        } catch (error) {
          console.log("planName", error);
        }
      };

    const getTaskName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/taskget", {
          });
          const data = response.data;
          const filter = data.map((data) => data.task_appAcronym);
          // filter = filter.filter(data => data.task_appAcrony== choosenAppName)
          setTaskAppAcronym(filter);
        } catch (error) {
          console.log("taskName", error);
        }
      };    
    

    
    const refreshToken = async () => {
        try {
          const response = await axios.get("http://localhost:5000/token");
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setOwner(decoded.username)
          setcurrentGroup(decoded.userGroup);
          // console.log(decoded.userGroup.indexOf("projectLead"))
          // if (decoded.userGroup.indexOf("projectLead") <= -1 ) {
          //   navigate("/mainmenu", { replace: true });
          // }
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

      // function myfunction(data) {
      //   return data.map(function(e) {
      //     return {
      //       app_acronym: e.app_acronym,
      //       app_RNumber: e.app_Rnumber
      //     };
      //   });
      // }

      // useEffect(() => {
      //   const appIdName=  myfunction(data);      
      //   let appIdCombi = appIdName.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_RNumber))
      //   appIdCombi = Number(appIdCombi)
      //   console.log(taskAppAcronym)
      //   console.log(appIdCombi)
      //   let count =0; taskAppAcronym.forEach(function(element,i ){
      //     if(element == choosenAppName){
      //       count ++;       
      //     }
      //   });
      //   const appIdCombiString = choosenAppName.concat("_" + (appIdCombi+ count))
      //   console.log(appIdCombiString)
      //   setId(appIdCombiString)

      //push to back end
      //   const noteCreation = username.concat(" state: open  @ " + Date())
      //   setNotes(noteCreation)

      // push to back end

        
        
      //   setCheckPermitCreate(data.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_permitCreate)))
      //   if(currentGroup.indexOf(checkPermitCreate.toString()) > -1){setDisablingButton(true)}
      //   else{setDisablingButton(false)}
      //   // console.log(currentGroup.indexOf(checkPermitCreate.toString()) > -1 )

      // }, [choosenAppName]);

    useEffect(()=>{
        // console.log(currentGroup.indexOf(data.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_permitCreate))) > -1)
        // setCheckPermitCreate(data.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_permitCreate)));
        if(currentGroup.indexOf(data.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_permitCreate))) > -1){
          setDisablingButton(false);
          // console.log(currentGroup.indexOf(data.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_permitCreate))))
        }
        else{setDisablingButton(true);
          // console.log(currentGroup.indexOf(data.filter((data) => data.app_acronym == choosenAppName).map((data => data.app_permitCreate))))
        };
        // console.log(planName)
        // console.log(currentGroup.indexOf(checkPermitCreate.toString()) > -1 )
        // const filter = planName.filter((data) => data.plan_appAcronym == choosenAppName).map((data) => data.plan_MVPName)
        // console.log(filter);
        // setPlanAppName(filter)
        // console.log(planName)
    }, [choosenAppName]);

 
    return (
        <div>
        <p className="has-text-centered">{msg}</p>

        <form  onSubmit={RegisterTask} onLoad={(e) => setSubmit(false)} className="columns is-multiline is-mobile px-2">
            <div className="column is-half ">
                <label className="label">Register New Task's Name</label>
                <input type="text" className="input" placeholder="Task Name" value={taskName}  required onChange={(e) => {if (e.code === 'Space') e.preventDefault(); setTaskName(e.target.value); }} />
            </div>
            <div className="column is-one-quarter">
                <label className="label">App</label>

                {appName && (
                    <Select
                    id="AdminUpdate"
                    className="basic-single"
                    options={appName.map((appName) => ({
                        value: appName,
                        label: appName
                    }))}
                    onChange={(choice) => {
                      console.log(choice)
                      setPlanAppName([])
                      setChoosenAppName(choice.value);}}
                    />)}
            </div>
            <div className="column is-one-quarter">
                <label className="label">Plan</label>
                {planName && (
                    <Select
                    value={ planAppName }
                    id="AdminUpdate"
                    className="basic-single"
                    // options={planAppName.map((planName) => ({
                    options={planName.filter((data) => data.plan_appAcronym == choosenAppName).map((data) => ({
                        value: data.plan_MVPName,
                        label: data.plan_MVPName
                    }))}
                    onChange={(choice) => {
                      setPlanAppName(choice);
                      setChoosenPlanName(choice.value)}}
                    />)}
            </div>
            <div className="column is-full">
                <label className="label">Description</label>
                <textarea type="text" className="textarea is-small" placeholder="Fill me" value={description} required onChange={(e) => setDescription(e.target.value)} />
            </div>
            {!disablingButton &&<div className="column is-full">
                 <button className="button is-success is-fullwidth" onClick={(e)=> {setSubmit(true); e.stopPropagation();}}>Register</button>
            </div>}
                </form>
            </div>
    )
}
 

export default RegisterTask