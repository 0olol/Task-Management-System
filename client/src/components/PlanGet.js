import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import jwt_decode from "jwt-decode";

 
const RegisterPlan =() => {
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const [groups, setGroup] = useState("");


    var date = new Date()
    const [MVPName, setMVPName] = useState('');
    const [startD, setStartD] = useState(new Date().toISOString().split("T")[0]);
    var date1 = date.setDate(date.getDate() + 1)  
    const [endD, setEndD] = useState(date.toISOString().split("T")[0]);
    const [submit,setSubmit] = useState('');
    const [choosenAppName, setChoosenAppName] = useState([]);// for the dropdown
    const [appName, setAppName] = useState([]); // for the form
    const [disabling, setdisabling] = useState(false);
    const [choosenPlanName, setChoosenPlanName] = useState([]);// for the dropdown for app
    const [planName, setPlanName] = useState([]); // for the form for app
    const [planData, setPlanData] = useState([]);// for the propping of data 
    // let emptyArray = [];

    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    // const emailInput = useAutoFocus(); ref={emailInput}
 
    const RegisterPlan = async (e) => {
        // console.log(choosenAppName)
        e.preventDefault();
        // console.log(choosenAppName.length)
        if(!choosenAppName.length){
          // console.log("hello")
          return setMsg("Choose Which App you want.")
        }
        // e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/planget', {
                MVPName: MVPName,
                startD: startD,
                endD: endD,
                choosenAppName:choosenAppName.toString()

            });
            setMsg(response.data.msg);
            // setSubmit(true)
            setMVPName("")
            setStartD(new Date().toISOString().split("T")[0])
            setEndD(date.toISOString().split("T")[0])
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        } finally{
          getPlanName();
        }
      // }else{
      //   // e.preventDefault();
      //   setMsg("hello")
      // }
    }

    const UpdatePlan = async (e) => {
        console.log(choosenAppName)
          e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/planupdate', {
                MVPName: MVPName,
                startD: startD,
                endD: endD,
            });
            setMsg(response.data.msg);
            // setSubmit(true)
            setMVPName("")
            setStartD(new Date().toISOString().split("T")[0])
            setEndD(date.toISOString().split("T")[0])
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const getAppName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/appget", {
          });
          const data = response.data;
          const filter = data.map((data) => data.app_acronym);
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
          setPlanName(filter);
        } catch (error) {
          console.log("planName", error);
        }
      };   
    
    const refreshToken = async () => {
        try {
          const response = await axios.get("http://localhost:5000/token");
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
        //   setName(decoded.username);
          setExpire(decoded.exp);
          setGroup(decoded.userGroup);
          // console.log(groups)
          // console.log(groups.indexOf("admin"||"Admin"))
          // console.log(decoded.userGroup.indexOf("admin"||"Admin"))
    
          if(decoded.userGroup.indexOf("projectManager") <= -1 ){
            navigate("/kanban", { replace: true });
          }
          
        } catch (error) {
          if (error.response) {
            navigate("/");
          }
        }
      };

    useEffect(() => {
        getAppName();
        getPlanName();
        refreshToken();
      }, []);

      useEffect(() => {
        console.log(choosenAppName)
      }, [choosenAppName]);

 
    return (
        <div>
        <p className="has-text-centered">{msg}</p>
        <button className="button has-text-centered my-3" name="id" onClick={(e) => {setdisabling(!disabling); setMVPName(""); setStartD(new Date().toISOString().split("T")[0]); setEndD(date.toISOString().split("T")[0]); }}> Edit mode</button>
        {disabling && planName && 
        <div>
        
        <label className="label">Edit Plan</label>

          <Select
          id="KanBan"
          // isMulti
          className="basic-single my-3"
          options={planName.map((planName) => ({
              value: planName,
              label: planName
          }))}
          onChange={(choice) => setChoosenPlanName(choice.value)}
          />
            
            <form  onSubmit={UpdatePlan} onLoad={(e) => setSubmit(false)} className="columns is-multiline is-mobile px-2">
            <div className="column is-full ">
                <label className="label">Register New Plan's Name</label>
                <label className="label">{choosenPlanName}</label>

            </div>

            <div className="column is-one-third ">
                <label className="label">Start Date</label>
                <input type="date" className="input is-lefted" value={startD} min={new Date().toISOString().split("T")[0]} required onChange={(e) => setStartD(e.target.value)} />
            </div>
            <div className="column is-one-third ">
                <label className="label">End Date</label>
                <input type="date" className="input" value={endD} min={startD} required onChange={(e) => setEndD(e.target.value)} />
            </div>
            <div className="column is-full">
                <button className="button is-success is-fullwidth" onClick={(e)=> {setSubmit(true); e.stopPropagation();}}>Updating</button>
            </div>
                </form>
            </div>
            }


        { !disabling && <form  onSubmit={RegisterPlan} onLoad={(e) => setSubmit(false)} className="columns is-multiline is-mobile px-2">
            <div className="column is-full ">
                <label className="label">Register New Plan's Name</label>
                <input type="text" className="input" placeholder="Plan Name" value={MVPName} required onChange={(e) => {if (e.code === 'Space') e.preventDefault(); setMVPName(e.target.value); }} />
            </div>

            <div className="column is-one-third ">
                <label className="label">Start Date</label>
                <input type="date" className="input is-lefted" value={startD} min={new Date().toISOString().split("T")[0]} required onChange={(e) => setStartD(e.target.value)} />
            </div>
            <div className="column is-one-third ">
                <label className="label">End Date</label>
                <input type="date" className="input" value={endD} min={startD} required onChange={(e) => setEndD(e.target.value)} />
            </div>
            <div className="column is-one-third">
                <label className="label">App</label>

                {appName && (
                    <Select
                    required
                    id="RegisterPlan"
                    className="basic-single"
                    classNamePrefix="select"
                    options={appName.map((appName) => ({
                        value: appName,
                        label: appName
                    }))}
                    onChange={(choice) => setChoosenAppName(choice.value)}
                    
                    />)}
            </div>
            <div className="column is-full">
                <button className="button is-success is-fullwidth" onClick={(e)=> {setSubmit(true); e.stopPropagation();}}>Register</button>
            </div>
                </form>}
            </div>
    )
}
 

export default RegisterPlan