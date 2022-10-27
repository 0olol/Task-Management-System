import { Card, CardActions, CardContent,Modal,Typography,Box   } from '@mui/material';
import React, { useState, useEffect } from 'react'
import axios from "axios";

// import Select from "react-select";


function PlanInfo(props){

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

    let filterApps = props.data.filter((data) => data.plan_MVPName == props.choosenPlanName)
    // console.log(filterApps.map((data) => data.plan_MVPName))
    // // typeof(filterApps.plan_MVPName)

    // console.log(filterApps.plan_startDate)
    // console.log(filterApps.plan_endDate)
    // console.log(filterApps.plan_appAcronym)

    return(
    <div className="box mx-5">
        Plan Task: {filterApps.map((data) => data.plan_MVPName)} <br/>
        Plan Start Date: {filterApps.map((data) => data.plan_startDate)} <br/>
        Plan End Date: {filterApps.map((data) => data.plan_endDate)} <br/>
        Linked App Name: {filterApps.map((data) => data.plan_appAcronym)} <br/>

    </div>
            
    )
}

export default PlanInfo