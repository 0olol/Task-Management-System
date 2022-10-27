import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('accounts',{
    username:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    userGroup:{
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.BOOLEAN
    }
},{
    freezeTableName:true
});

export const UsersGroup = db.define('usergroup',{
   groupName:{
    type:DataTypes.STRING,
    primaryKey: true
   }
},{
    freezeTableName:true,
    timestamps:false
});

export const App = db.define('application',{
    app_acronym:{
        type: DataTypes.STRING,
        primaryKey: true
    },app_description:{
        type:DataTypes.TEXT
    },app_Rnumber:{
        type:DataTypes.INTEGER
    },app_startDate:{
        type:DataTypes.DATE
    },app_endDate:{
        type:DataTypes.DATE
    },app_permitOpen:{
        type:DataTypes.STRING
    },app_permitToDo:{
        type:DataTypes.STRING
    },app_permitDoing:{
        type:DataTypes.STRING
    },app_permitDone:{
        type:DataTypes.STRING
    },app_permitCreate:{
        type:DataTypes.STRING
    }
    
},{
    freezeTableName:true,
    timestamps:false

});

export const Plan = db.define('plan',{
    plan_MVPName:{
        type:DataTypes.STRING,
        primaryKey: true
    },plan_startDate:{
        type:DataTypes.DATE
    },plan_endDate:{
        type:DataTypes.DATE
    },plan_appAcronym:{
        type:DataTypes.STRING
    }
},{
    freezeTableName:true,    
    timestamps:false
});

export const Task = db.define('task',{
    task_name:{
        type:DataTypes.STRING
    },task_description:{ // used at the start
        type:DataTypes.TEXT
    },task_notes:{ //is for them to put in the audit trail 
        type:DataTypes.TEXT
    },task_id:{ // combi of running number and app name
        primaryKey: true,
        type:DataTypes.STRING
    },task_plan:{ // to put the plan name to the task name 
        type:DataTypes.STRING
    },task_appAcronym:{ // to put the app name to the task name
        type:DataTypes.STRING
    },task_state:{ // in open, todo, doing, done, close
        type:DataTypes.STRING
    },task_creator:{// team lead, set it 
        type:DataTypes.STRING
    },task_owner:{ // person who last touched
        type:DataTypes.STRING
    },task_createDate:{// the date created set it
        type:DataTypes.DATE
    }
},{
    freezeTableName:true,
    timestamps:false
});

 
(async () => {
    await db.sync();
})();
 
export default Users;