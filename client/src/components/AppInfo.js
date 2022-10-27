import { Card, CardActions, CardContent,Modal,Typography,Box   } from '@mui/material';
import React, { useState, useEffect } from 'react'
import axios from "axios";

// import Select from "react-select";


function AppInfo(props){

    // const [open, setOpen] = useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    // // console.log(props.data)
    // const filterApps = props.data.filter((data) => data.task_appAcronym == props.choosenAppName)
    // console.log(filterApps)
    // const filterPlan = filterApps.filter((data) => data.task_plan == props.choosenPlanName)
    // console.log(filterPlan)
    // let filterTaskName = filterPlan.map((data) => data.task_name ) 
    // let filterTaskId = filterPlan.map((data) => data.task_id ) 
    // let filterTaskCreated = filterPlan.map((data) => Date(data.task_createDate).split("T")[0]) 
    console.log(props.data)
    // console.log(props)
    let filterApps = props.data.filter((data) => data.app_acronym == props.choosenAppName )



      
    return(
    <div className="box mx-5">
        {/* <CloseButton/> */}
        App Name: {filterApps.map((data) => data.app_acronym)}<br/>
        App Description: 
        <textarea className="textarea is-link" disabled value={filterApps.map((data) => data.app_description)}/>
        App RNumber : {filterApps.map((data) => data.app_Rnumber)}<br/>
        App Start Date: {filterApps.map((data) => data.app_startDate)}<br/>
        App End Date: {filterApps.map((data) => data.app_endDate)}<br/>
        App Open Permit: {filterApps.map((data) => data.app_permitOpen)}<br/>
        App To Do Permit: {filterApps.map((data) => data.app_permitToDoList)}<br/>
        App Doing Permit: {filterApps.map((data) => data.app_permitDoing)}<br/>
        App Done Permit: {filterApps.map((data) => data.app_permitDone)}<br/>
        App Create Permit: {filterApps.map((data) => data.app_permitCreate)}<br/>

    </div>
            
    )
}

export default AppInfo