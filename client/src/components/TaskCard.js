import { Modal   } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import axios from "axios";
// import TaskCardModal from './TaskCardModal'

import Select from "react-select";


const TaskCard= (props) =>{
    const [choosenPlanName, setChoosenPlanName] = useState('');// for the dropdown for app
    const [planName, setPlanName] = useState([]); // for the form for app

    const [disablingleft, setDisablingLeft] = useState(true);
    const [disablingright, setDisablingRight] = useState(true);
    const [disablingForm, setDisablingForm] = useState(true);

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null); // for the activation of modal from button key

    const [description, setDescription] = useState("");// new note, should prob change the name of this .....
    const [editDescription, setEditDescription] = useState("");// new note, should prob change the name of this .....
    const [notes, setNotes] = useState(''); // old note
    const [newState,setNewState] = useState(props.state); // setting the state to be push to update
    const [taskName, setTaskName] = useState('');
    const [newData, setNewData] = useState('');
    const [open,setOpen] = useState(false);
    const [open2,setOpen2] = useState(false);
    const [msg, setMsg] = useState('');
    const [taskId, setTaskId] = useState('');

    // const [filterApps, setFilterApps] = useState(props.data.filter((data) => data.task_appAcronym == props.choosenAppName|| props.choosenAppName == "defaultValue" ));
    // const [forcingTech, setFilteredPlan] = useState(filterApps.filter((data) => data.task_plan == props.choosenPlanName   ||props.choosenPlanName == "defaultValue" || props.choosenPlanName == ""));
    // const []
    // const [taskOwner, setTaskOwner] = useState(props.username);
    const [taskPlanNewName, setTaskPlanNewName] = useState('');

    const navigate = useNavigate();
    
    const state = new Map();
    state.set(1,"open")
        .set(2,"toDo")
        .set(3,"doing")
        .set(4,"done")
        .set(5,"close");
    


    // console.log(props)
    // console.log(planName)
    // console.log(newState)
    const filterApps = props.data.filter((data) => data.task_appAcronym == props.choosenAppName|| props.choosenAppName == "defaultValue" )
    // console.log(filterApps)
    const filteredPlan = filterApps.filter((data) => data.task_plan == props.choosenPlanName   ||props.choosenPlanName == "defaultValue" || props.choosenPlanName == "")
    // console.log(filteredPlan)
    // console.log(props.choosenAppName)


    const TaskCard = async (e) => {
        try {
            // console.log(notes)
            const response = await axios.post('http://localhost:5000/taskupdate', {
                taskName:taskName,
                // notes: notes.concat( "\n\n" + description + " state: "+ props.state +  "@ " + Date()),
                notes: description.concat(". \nBy: " + props.username  +  " @ " + Date() +"\n\n" + notes ),
                state: newState,
                owner: props.username,
                plan:choosenPlanName,
                taskid:taskId
            });
            // if(response){console.log("what is response", response);}
            // console.log("what is response", response)
            // console.log("send");
            setMsg(response.data.msg);
            // navigate("/kanban");
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.msg)
                setMsg(error.response.data.msg);
            }
        } 
        finally{
            props.setSubmit(true);
            setNotes(description.concat(".\nBy " + props.username +" @ " + Date() +"\n\n" + notes ));
            setOpen(false);
            setEditDescription("");
            // setDescription("");
            // console.log("finally")
            // console.log(description.concat(" by " + props.username + " state: "+ props.state +  " @ " + Date() +"\n\n" + notes ))
        }
    }
    
    
    const EmailDone = async (e) =>{
        console.log(open2)
        try{
            const response = await axios.post('http://localhost:5000/emaildone', {
                appname: props.choosenAppName,
                username: props.username,
                taskId:taskId
        });
            console.log(open2)
            // setOpen2(false);
        }catch(error){
            if (error.response) {
                console.log(error.response.data.msg)
                setMsg(error.response.data.msg);
            }
        }
    }

// modal function 
    const expandModal = (task) => {
        setSelectedProject(task);
        setModalIsOpen(true);
        setTaskPlanNewName(task.task_plan)
        setChoosenPlanName(task.task_plan)
        setTaskId(task.task_id)
    }
    
    const closeModal = () => {
        setSelectedProject(null);
        setModalIsOpen(false);
    }
// promoting and demoting button 
    const demoting = (e,notees,plaaaaanName) => {
        // console.log("demoting")
        state.forEach((value,key,state) => {
            if(value == props.state){
                setChoosenPlanName(plaaaaanName);
                setTaskName(e);
                setDescription("Demoted from " + state.get(key) + " to " + state.get(key-1));
                setNewState(state.get(key -1));
                setNotes(notees);
                setOpen(true);
                // TaskCard();

                // console.log(plaaaaanName)
                // console.log(notes)
                // console.log(state.get(key-1))
                // TaskCard();
                // props.setSubmit(true);
            }
        })
    }
// useEffect(() =>{
//     setOpen(false);
// }, []);


    const promoting = (e, notees,plaaaaanName,iiiiidddd) => {
        // console.log("promoting")
        state.forEach((value,key,state) => {
            if(value == props.state){
                // console.log(plaaaaanName)
                setChoosenPlanName(plaaaaanName);
                setTaskName(e);
                setDescription("Promoted from " + state.get(key) + " to " + state.get(key+1) );

                setNotes(notees);
                // console.log(state.get(key+1));
                setNewState(state.get(key+1));
                setOpen(true);
                // setTaskId(iiiiidddd);
                console.log(iiiiidddd)
                console.log(open2)
                if(state.get(key+1) == "done"){
                    // console.log(state.get(key+1), "doingx")
                    //call for email api
                setOpen2(true);
                }
            }
        })
    }


    // const disaabled = () => {
    //     if (props.state == "open" || props.state == "toDo") {
    //         setDisablingLeft(false);
    //     }else{
    //         setDisablingLeft(true);
    //         setDisablingRight(true);
    //     }
    // } 

//close is being force close cause it doesnt have a checkowner therefore always false
// though i gave it a usergroup to let me skip the system ^^ 

    const disablingOwner = ()=> {
        if(props.checkOwner == props.userGroup){
            // console.log(props.userGroup)
            // console.log(props.checkOwner)
            if(props.state == "open" || props.state == "toDo"){
                setDisablingRight(true);
                setDisablingForm(true);
            }else{
                setDisablingForm(true);
                setDisablingLeft(true);
                setDisablingRight(true);
            }}else{
            setDisablingLeft(false);
            setDisablingRight(false);
            setDisablingForm(false)
    }}

//form submittion button 
// need to clear the try and finally if can.
    const formSubmit = (e) => {
        // TaskCard();
        if(taskPlanNewName != choosenPlanName){
            try{
                setTaskPlanNewName(choosenPlanName);
                if(editDescription) { setDescription("Changed of Plans: ".concat(choosenPlanName +". Notes: " + editDescription +". State: "+ props.state))}
                else{setDescription("Changed of Plans: ".concat(choosenPlanName + ". State: "+ props.state))}            
                    // + " by " + props.username + " state: "+ props.state +  " @ " + Date() +"\n" + notes ));
            }finally{
                setOpen(true)
                // TaskCard();
            }
            // console.log(notes)
        }else{
            setTaskPlanNewName(choosenPlanName);
            setDescription("Notes: " + editDescription +". State: "+ props.state)
            setOpen(true)
        }

    }
    
    useEffect(() => {
        setPlanName(props.planData);
        disablingOwner();
      }, [filteredPlan]);

    useEffect(() =>{
        // setOpen(false);
        if(open){TaskCard()}
        
    }, [open]);

    useEffect(() =>{
        if(open2){EmailDone()}
        setOpen2(false);
    }, [open2]);
    

    // useEffect(() => {
    //     setNewData(filteredPlan);
    //     console.log(newData)
    //   }, [taskName]);

    // useEffect(() =>{
    //     // setDescription("");
    //     // console.log(filterApps)
    //     // console.log("refresh")
    //     // console.log(filteredPlan);
    //     setFilterApps((props.data.filter((data) => data.task_appAcronym == props.choosenAppName|| props.choosenAppName == "defaultValue" )));
    //     setFilteredPlan(filterApps.filter((data) => data.task_plan == props.choosenPlanName   ||props.choosenPlanName == "defaultValue" || props.choosenPlanName == ""))
    // },[]);

    return(
    <div>
        {filteredPlan.map((task) =>(
            
        <div className="box px-0 pb-0 mb-1" key={task.task_id}>
            <div className="box px-0 m-0">
            Task Name: {task.task_name} <br/>
            Task Id: {task.task_id} <br/>
            Task Created: {task.task_createDate} <br/>
            Task Plan: {task.task_plan} <br/>
            </div>
        
        {disablingleft && <button className=" button is-small" onClick= {() => {demoting(task.task_name, task.task_notes,task.task_plan); setTaskId(task.task_id);}}> Demote</button>} 
        <button className=" button is-small" onClick={() =>{expandModal(task); setDescription(""); setNotes(task.task_notes)}}>Details</button>            
        {disablingright && <button className=" button is-small" onClick= {() => {promoting(task.task_name, task.task_notes, task.task_plan, task.task_id); setTaskId(task.task_id); } }> Promote</button>}
        </div>
        ))}
       <Modal open={modalIsOpen}
        // ^ is the data i need to change to force a rerender, by placing something that comes in from time to time 

        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
           <div className="columns box">
           <div className="column">
            <label className="label">{selectedProject && selectedProject.task_name }</label> 
            <label className="label">Task Plan: {selectedProject && taskPlanNewName }</label> 

            <label className="label">Description</label>
           <textarea className="textarea is-link" value={selectedProject && selectedProject.task_description} disabled />
            {/* <textarea className="textarea is-link " disabled>{selectedProject && selectedProject.task_description }</textarea> */}
            <label className="label">Notes</label>
            {/* <textarea className="textarea is-link" disabled >{selectedProject && selectedProject.task_notes }</textarea> */}
           
           {/* <textarea className="textarea is-link" value={ selectedProject && notes} disabled />  */}
           <textarea className="textarea is-link" value={notes} disabled /> 
           
           </div>
           {disablingForm &&
           
           <form onSubmit={(e) =>{formSubmit();e.preventDefault();  }} onLoad={() => props.setSubmit(false)} className="column ">
            <p className="has-text-centered">{msg}</p>
           
            <label className="label"> Add notes</label>
            <textarea type="password" className="textarea is-small" placeholder="Fill me" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />

            {planName && (
            <Select
            id="KanBan"
            // isMulti
            defaultValue={planName.filter((data) => data == taskPlanNewName).map((planName) => ({
                value: planName,
                label: planName
            })
                )}
            className="basic-single"
            options={planName.map((planName) => ({
              value: planName,
              label: planName
          }))}
          onChange={(choice) => setChoosenPlanName(choice.value)}
          />)}
            <button className="button is-success is-fullwidth" onClick={(e)=> {props.setSubmit(true); e.stopPropagation(); setTaskName(selectedProject.task_name);  
                 setNewState(selectedProject.task_state);}}>Register</button>
           </form> }
           </div> 
        </Modal>
    </div>
            
    )
}

export default TaskCard

// setSelectedProject(filteredPlan); setNotes(notes);