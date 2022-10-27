import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import jwt_decode from "jwt-decode";


const RegisterApp =() => {
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const [groups, setGroup] = useState("");


    var date = new Date()
    const [acro, setAcro] = useState('');
    const [description, setDescription] = useState('');
    const [description2, setDescription2] = useState('');

    const [RNumber, setRNumber] = useState('');
    const [startD, setStartD] = useState(new Date().toISOString().split("T")[0]);
    var date1 = date.setDate(date.getDate() + 1)  
    const [endD, setEndD] = useState(date.toISOString().split("T")[0]);
    const [msg, setMsg] = useState('');
    const [submit,setSubmit] = useState('');
    const [open, setOpen] = useState([]);// for the dropdown
    const [toDo, setToDo] = useState([]);// for the dropdown
    const [doing, setDoing] = useState([]);// for the dropdown
    const [done, setDone] = useState([]);// for the dropdown
    const [create, setCreate] = useState([]);// for the dropdown
    const [groupName, setGroupName] = useState([]); // for the form
    const [disabling, setdisabling] = useState(false);
    const [appName, setAppName] = useState([]); // for the form
    const [appData, setAppData] = useState([]);// for the propping of data 
    const [choosenAppName, setChoosenAppName] = useState();// for the dropdown for app

    const navigate = useNavigate();


    // const emailInput = useAutoFocus(); ref={emailInput}
 
    const RegisterApp = async (e) => {
        //   e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/appget', {
                acro: acro,
                description: description,
                RNumber: RNumber,
                startD: startD,
                endD:endD,
                open:open.toString(),
                toDo:toDo.toString(),
                doing:doing.toString(),
                done:done.toString(),
                create:create.toString() 
            });
            setMsg(response.data.msg);
            setAcro("")
            setDescription("")
            setRNumber("")
            setStartD(new Date().toISOString().split("T")[0])
            setEndD(date.toISOString().split("T")[0])
            // setSubmit(true)
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }finally{
            getAppName();
        }
    }

    const UpdateApp = async (e) => {
        e.preventDefault();
      try {
          const response = await axios.post('http://localhost:5000/appupdate', {
              acro: acro,
              description: description2,
              RNumber: RNumber,
              startD: startD,
              endD:endD,
              open:open.toString(),
              toDo:toDo.toString(),
              doing:doing.toString(),
              done:done.toString(),
              create:create.toString() 
          });
          setMsg(response.data.msg);
          setDescription2("")
          setStartD(new Date().toISOString().split("T")[0])
          setEndD(date.toISOString().split("T")[0])
          // setSubmit(true)
      } catch (error) {
          if (error.response) {
              setMsg(error.response.data.msg);
          }
      }
  }
    
    const getGroups = async () => {
        try {
          const response = await axios.get("http://localhost:5000/userGroup", {
          });
          const data = response.data;
          const filter = data.map((data) => data.groupName);
          setGroupName(filter);
        } catch (error) {
          console.log("groupname", error);
        }
      };

    const getAppName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/appget", {
          });
          const data = response.data;
          setAppData(data)
          const filter = data.map((data) => data.app_acronym);
        //   filter.unshift("defaultValue")
          setAppName(filter);
        } catch (error) {
          console.log("appName", error);
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
    
          if(decoded.userGroup.indexOf("projectLead") <= -1 ){
            navigate("/kanban", { replace: true });
          }
          
        } catch (error) {
          if (error.response) {
            navigate("/");
          }
        }
      };

    useEffect(() => {
        getGroups();
        getAppName();
        refreshToken();
      }, []);
    
    useEffect(() => {
        const filter = appData.filter((data)=> data.app_acronym == choosenAppName).map((data)=> data.app_Rnumber);
        // const filter2 = groupName.filter((data) => data == appData.filter((data) => data.app_acronym == choosenAppName).map((data) => (data.app_permitOpen))).map((groupName) => ({
        //     value: groupName,
        //     label: groupName
        // }));
        const filter3 = appData.filter((data)=> data.app_acronym == choosenAppName).map((data)=> data.app_description)
        setDescription2(filter3.toString())
        // console.log(filter)
        console.log(filter3)
        setRNumber(filter);
        setAcro(choosenAppName)
    }, [choosenAppName]);

    // const handleChange = (e) => {
    //     setOpen( e.map((e)=> e.value));
    //     console.log(e.map((e)=> e.value));
    // } 
    // const handleChange1 = (e) => {
    //     setToDo( e.map((e)=> e.value));
    //     console.log(e.map((e)=> e.value));
    // }
    // const handleChange2 = (e) => {
    //     setDoing(e.map((e)=> e.value));
    //     console.log(e.map((e)=> e.value));
    // }
    // const handleChange3 = (e) => {
    //     setDone( e.map((e)=> e.value));
    //     console.log(e.map((e)=> e.value));
    // }
    // const handleChange4 = (e) => {
    //     setCreate( e.map((e)=> e.value));
    //     console.log(e.map((e)=> e.value));
    // }
    // appName.filter((data)=>{ data.RNumber == choosenAppName}).map((data)=>)
    return (
        <div>
            <p className="has-text-centered">{msg}</p>
            <button className="button has-text-centered my-3" name="id" onClick={(e) => {setdisabling(!disabling); setAcro(""); setRNumber(""); setStartD(new Date().toISOString().split("T")[0]); setEndD(date.toISOString().split("T")[0]); }}> Edit mode</button>
            {appName && disabling && 
            <div>
            <label className="label ">Edit App</label>

            <Select
            id="KanBan"
            className="basic-single my-3"
            options={appName.map((appName) => ({
                value: appName,
                label: appName
            }))}
            onChange={(choice) => setChoosenAppName(choice.value)}
            />
            <form  onSubmit={UpdateApp} onLoad={(e) => setSubmit(false)} className="columns is-multiline is-mobile px-2">
                    <div className="column is-half ">
                        <label className="label">Register New App's Name</label>
                        <label className="label">{choosenAppName}</label>
                        
                    </div>
                    <div className="column is-half ">
                        <label className="label">Running Number</label>
                        <label className="label">{appData.filter((data)=> data.app_acronym == choosenAppName).map((data)=> data.app_Rnumber)}</label>

                    </div>
                    <div className="column is-full">
                        <label className="label">Description</label>
                        <textarea type="password" className="textarea is-small" placeholder="Fill me" value={description2} required onChange={(e) => setDescription2(e.target.value)} />
                    </div>
                    <div className="column is-half ">
                        <label className="label">Start Date</label>
                        <input type="date" className="input is-lefted" value={startD} min={new Date().toISOString().split("T")[0]} required onChange={(e) => setStartD(e.target.value)} />
                    </div>
                    <div className="column is-half ">
                        <label className="label">End Date</label>
                        <input type="date" className="input" value={endD} min={startD} required onChange={(e) => setEndD(e.target.value)} />
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Open</label>

                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            // defaultValue={groupName.filter((data) => data == appData.filter((data) => data.app_acronym == choosenAppName).map((data) => (data.app_permitOpen))).map((groupName) => ({
                            //     value: groupName,
                            //     label: groupName
                            // }))}
                            menuPlacement="top"
                            // menuPosition="fixed"
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setOpen(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">To Do</label>
                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            // defaultValue={appData.filter((data) => data.app_acronym == choosenAppName).map((data) => (data.app_permitToDo))}
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setToDo(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Doing</label>

                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            // defaultValue={appData.filter((data) => data.app_acronym == choosenAppName).map((data) => ({
                            //     value: data.app_permitDoing,
                            //     label: data.app_permitDoing
                            // }))}
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setDoing(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Done</label>
                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            // defaultValue={appData.filter((data) => data.app_acronym == choosenAppName).map((data) => ({
                            //     value: data.app_permitDone,
                            //     label: data.app_permitDone
                            // }))}
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setDone(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Create</label>
                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            // defaultValue={appData.filter((data) => data.app_acronym == choosenAppName).map((data) => ({
                            //     value: data.app_permitCreate,
                            //     label: data.app_permitCreate
                            // }))}
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setCreate(choice.value)}
                            />)}
                    </div>
                    <div className="column is-full">
                        <button className="button is-success is-fullwidth" onClick={(e)=> {setSubmit(true); e.stopPropagation();}}>Update</button>
                    </div>
                </form>
            </div>
            }

                {!disabling && <form  onSubmit={(e) =>{RegisterApp(); getAppName(); e.preventDefault();} } onLoad={(e) => setSubmit(false)} className="columns is-multiline is-mobile px-2">
                    <div className="column is-half ">
                        <label className="label">Register New App's Name</label>
                        <input type="text" className="input" placeholder="App Name" value={acro}  required onChange={(e) => {if (e.code === 'Space') e.preventDefault(); setAcro(e.target.value); }} />
                    </div>
                    <div className="column is-half ">
                        <label className="label">Running Number</label>
                        <input type="number" className="input" min="1" placeholder="No." value={RNumber} required onChange={(e) => setRNumber(e.target.value)} />
                    </div>
                    <div className="column is-full">
                        <label className="label">Description</label>
                        <textarea type="password" className="textarea is-small" placeholder="Fill me" value={description} required onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="column is-half ">
                        <label className="label">Start Date</label>
                        <input type="date" className="input is-lefted" value={startD} min={new Date().toISOString().split("T")[0]} required onChange={(e) => setStartD(e.target.value)} />
                    </div>
                    <div className="column is-half ">
                        <label className="label">End Date</label>
                        <input type="date" className="input" value={endD} min={startD} required onChange={(e) => setEndD(e.target.value)} />
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Open</label>

                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setOpen(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">To Do</label>
                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setToDo(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Doing</label>

                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setDoing(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Done</label>
                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setDone(choice.value)}
                            />)}
                    </div>
                    <div className="column is-one-fifth ">
                        <label className="label">Create</label>
                        {groupName && (
                            <Select
                            id="RegisterApp"
                            // isMulti
                            className="basic-single"
                            menuPlacement="top"
                            options={groupName.map((groupName) => ({
                                value: groupName,
                                label: groupName
                            }))}
                            onChange={(choice) => setCreate(choice.value)}
                            />)}
                    </div>
                    <div className="column is-full">
                        <button className="button is-success is-fullwidth" onClick={(e)=> {setSubmit(true); e.stopPropagation();}}>Register</button>
                    </div>
                </form>}
            </div>                        
    )
}
 

export default RegisterApp