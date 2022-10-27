import Users, {UsersGroup,App,Plan,Task} from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['username','email','userGroup','status']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

//Check whether if this account username is an admin if not whether the account is enabled anot
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
//Need to rewrite this for mainMenu again. Double check the other checkgroup first.
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// export const checkGroup = async(req, res) => {
//     const username = req.headers['username'];
//     try {
//         const user = await Users.findAll({where:{username: username}});
//         const admin = user[0].userGroup;
//         const userStatus = user[0].status;
//         if(admin.indexOf("admin") >- 1  ) return res.json(true);
//         // else if (userStatus) return res.json(userStatus);
//         else  return res.json(false);
//     }catch (error) {
//         console.log(error);
//         }
// }


//Registering new account with default userGroup and Status enabled
export const Register = async(req, res) => {
     var passw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/ ;
     var useername = /^\S*$/;
     var eeeemail = /\S+@\S+\.\S+/;
    const { username, email, password, confPassword } = req.body;
    if(!useername.test(username)) return res.status(400).json({msg: "Username cannot contain spaces"});
    if(!eeeemail.test(email)) return res.status(400).json({msg: "Email is not valid"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    if(!passw.test(password)) return res.status(400).json({msg: "Password need 8-10 letters,a special character and number"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            username: username,
            email: email,
            password: hashPassword,
            userGroup: 'user',
            status:true
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
        res.json({msg: "Duplicate Account"});
        
    }
}

// Update the email or the pw or both 
export const Update = async(req, res) => {
    const { username,email, password, confPassword } = req.body;
    var passw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/ ;
    var eeeemail = /\S+@\S+\.\S+/;
    if(!eeeemail.test(email)) return res.status(400).json({msg: "Invalid Email"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    if(password) {
        if(!passw.test(password)) return res.status(400).json({msg: "Password need 8-10 letters,a special character and number"});
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.update({
                email: email,
                password: hashPassword
            },
            {
                where:{username:username}
            });
             res.json({msg: "Update Successful"});
        } catch (error) {
            console.log(error);
        }
    } else {
        
        try {
            await Users.update({
                email: email
            },
            {
                where:{username:username}
            });        res.json({msg: "Update email Successful"});
            }catch(error){
                console.log(error);
            }
    }

}

//
export const getGroup = async(req, res) => {
    try {
        const groupsName = await UsersGroup.findAll({
            attributes:['groupName']
        });
        res.json(groupsName);
    } catch (error) {
        console.log(error);
    }
}

//
export const registerGroup = async(req, res) => {
    const { groupName } = req.body;
    var useergroup = /^\S*$/;
        if(!useergroup.test(groupName)) return res.status(400).json({msg: "Cannot be empty spaces"});
        try {
            await UsersGroup.create({
                groupName:groupName
            });
            res.json({msg: "Registration Successful"});
        } catch (error) {
            console.log(error);
            res.json({msg: "Duplicated user group"});
            
        }
}

//
export const AdminGetInfo = async(req, res) => {
    const username = req.headers['username'];
    try {
        const users = await Users.findOne({
            attributes:['username','email','userGroup','status'],
            where:{username: username}
        });

        res.json(users);
    } catch (error) {
        console.log(error);
    }
}



//
export const AdminUpdate = async(req, res) => {
    const { username, email, password, confPassword, userGroup, status } = req.body;
    var passw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/ ;
    var eeeemail = /\S+@\S+\.\S+/;
    if(!eeeemail.test(email)) return res.status(400).json({msg: "Invalid Email"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    if(!username) return res.status(400).json({msg:"Please press an user to edit"});
    if(password) {
        if(!passw.test(password)) return res.status(400).json({msg: "Password need 8-10 letters,a special character and number"});
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.update({
                email: email,
                password: hashPassword,
                userGroup:userGroup,
                status:status
            },
            {
                where:{username:username}
            });
             res.json({msg: "Update Successful"});
        } catch (error) {
            console.log(error);
        }
    } else {
        
        try {
            await Users.update({
                email: email,
                userGroup:userGroup,
                status:status
            },
            {
                where:{username:username}
            });        res.json({msg: "Update without PW Successful"});
            }catch(error){
                console.log(error);
            }
    }

}
 
// Logging in to dash board with assigning token and updating after 300secs
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{username: req.body.username}
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(401).json({msg: "Wrong Username or Password"});
        const username = user[0].username;
        const userStatus = user[0].status;
    
        const accessToken = jwt.sign({userStatus, username}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userStatus, username}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                username: username
            }
        });
        if (!userStatus) return res.status(403).json({msg:"Disabled"});
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.sendStatus(411);
        console.log(error);
        // console.log(res.status(411))
    }
}

// Removing token from client and server side
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const username = user[0].username;
    await Users.update({refresh_token: null},{
        where:{
            username: username
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

// Get App data to display
export const getApp = async(req, res) => {
    // const acro = req.headers['acro'];
    try {
        const app = await App.findAll({
            attributes:['app_acronym','app_description','app_Rnumber','app_startDate','app_endDate','app_permitOpen','app_permitToDo','app_permitDoing','app_permitDone','app_permitCreate'],
            // where:{app_acronym: acro}
        });
        res.json(app);
    } catch (error) {
        console.log(error);
    }
}

// Post to create App
export const createApp = async(req, res) => {
    const { acro, description, RNumber, startD,endD,open,toDo,doing,done,create } = req.body;
    // var acccrroooo = /^\S*$/;
    // if(!acccrroooo.test(acro)) return res.status(400).json({msg: "New App name cannot contain spaces"});
    try {
        await App.create({
            app_acronym: acro,
            app_description: description,
            app_Rnumber: RNumber,
            app_startDate: startD,
            app_endDate:endD,
            app_permitOpen: open,
            app_permitToDo: toDo,
            app_permitDoing: doing,
            app_permitDone: done,
            app_permitCreate: create

        });
        res.json({msg: "Create Successful"});
    } catch (error) {
        console.log(error);
        res.json({msg: "Duplicate App"});
    }
}

// Post App to update App
export const appUpdate = async(req, res) => {
    const { acro, description, RNumber, startD,endD,open,toDo,doing,done,create } = req.body;
    try {
        await App.update({
            app_description: description,
            app_startDate: startD,
            app_endDate:endD,
            app_permitOpen: open,
            app_permitToDo: toDo,
            app_permitDoing: doing,
            app_permitDone: done,
            app_permitCreate: create
        },
        {
            where:{app_acronym: acro}
        });
         res.json({msg: "Update Successful"});
    } catch (error) {
        console.log(error);
    }
}

// Get Plan data to display
export const getPlan = async(req, res) => {
    // const MVPName = req.headers['MVPName'];
    try {
        const plan = await Plan.findAll({
            attributes:['plan_MVPName','plan_startDate','plan_endDate','plan_appAcronym'],
            // where:{plan_MVPName: MVPName}
        });
        res.json(plan);
    } catch (error) {
        console.log(error);
    }
}

// Post to create App
export const createPlan = async(req, res) => {
    const { MVPName, startD, endD, choosenAppName } = req.body;
    // var mmmmvvvpppp = /^\S*$/;
    // if(!mmmmvvvpppp.test(MVPName)) return res.status(400).json({msg: "New Plan name cannot contain spaces"});
    try {
        await Plan.create({
            plan_MVPName: MVPName,
            plan_startDate: startD,
            plan_endDate: endD,
            plan_appAcronym: choosenAppName
        });
        res.json({msg: "Create Successful"});
    } catch (error) {
        console.log(error);
        res.json({msg: "Duplicate Plan"});
    }
}

//Post Plan to update Plan
export const planUpdate = async(req, res) => {
    const { MVPName, startD, endD } = req.body;
    try {
        await Plan.update({
            plan_startDate: startD,
            plan_endDate: endD,
        },
        {
            where:{plan_MVPName: MVPName}
        });
         res.json({msg: "Update Successful"});
    } catch (error) {
        console.log(error);
    }
}

// Get Task data to display
export const getTask = async(req, res) => {
    // const taskName = req.headers['taskName'];
    try {
        const task = await Task.findAll({
            attributes:['task_name','task_description','task_notes','task_id','task_plan','task_appAcronym','task_state','task_creator','task_owner','task_createDate'],
            // where:{task_name: taskName}
        });
        res.json(task);
    } catch (error) {
        console.log(error);
    }
}

// Post to create App
export const creatingTask = async(req, res) => {
    const { taskName, description,plan,acronName,creator,owner, } = req.body;
    let app = []
    let id = ""
    let id2 = ""

    try {
        app = await App.findOne({
            attributes:['app_Rnumber'],
            where:{app_acronym: acronName}  
        });

        await App.update({
            app_Rnumber: (app.app_Rnumber +1)},
        {where:{app_acronym: acronName}});

        id2 = id.concat(acronName+ "_" + app.app_Rnumber )
        console.log(id2)

    } catch (error) {
        console.log(error);
        res.json({msg: "Duplicate Task"});
    }
     finally{
        await Task.create({
            task_name: taskName,
            task_description: description,
            task_notes: owner.concat(" state: open @ " + Date()),
            task_id: id2,
            task_plan:plan,
            task_appAcronym: acronName,
            task_owner: owner,
            task_creator: creator,// cannot hard code this 
            task_state: "open",
            task_createDate:(new Date().toISOString().split("T")[0])
        });
        res.json({msg: "Create Successful"});
    }
}

// Post Task to update Task
export const taskUpdate = async(req, res) => {
    const { taskName, notes,state,owner,plan,taskid} = req.body;
    try {
        await Task.update({
            task_notes: notes,
            task_plan:plan,
            task_owner: owner,
            task_state: state
        },
        {
            where:{task_id:taskid}
        });
         res.json({msg: "Update Successful"});
    } catch (error) {
        console.log(error);
    }
}
// Email for others 
export const getAllUserEmail = async (req, res) => {
    const {username, appname,taskId} = req.body;
    let play =[]
    let app = []
    let inCharge = []
    let shit = []
    try {
        play = await Users.findAll({
            attributes:['email'],
            where:{username: username}
        });
        app = await App.findOne({
            attributes:['app_permitDone'],
            where:{app_acronym: appname}  
        });
        inCharge = await Users.findAll({
            attributes:['email'],
            where:{userGroup: app.app_permitDone}
        });
        // console.log(typeof(play[0]),play[0].email, "hello") // correct liao 
        // console.log(typeof(app[0]),app.app_permitDone,"hello")
    } catch (error) {
        console.log(error);
    }
    finally{
        const shit2 = inCharge.forEach(element => shit.push(element.email))
        console.log(taskId)
        var transporter = nodemailer.createTransport({
              host: "smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "fdb48f7c3a1c3b",
                pass: "6408d5bf1bef06"
              },
            })
        let info = await transporter.sendMail({

            from:`${play[0].email}`,
            to: `${shit}`,

            // to:`${play[0].email}`,

            subject: `Task ${taskId} Completed ✔`, // Subject line

            text: `${username} has finish the task: ${taskId}  on '${new Date().toUTCString()}'`,

            html: `${username} has finish the task: ${taskId} on '${new Date().toUTCString()}'`, // html body
            })
            console.log("Message sent: %s", info.messageId)
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}

// export const checkGroup = async(req, res) => {
//     const username = req.headers['username'];
//     try {
//         const user = await Users.findAll({where:{username: username}});
//         const admin = user[0].userGroup;
//         const userStatus = user[0].status;
//         if(admin.indexOf("admin") >- 1  ) return res.json(true);
//         // else if (userStatus) return res.json(userStatus);
//         else  return res.json(false);
//     }catch (error) {
//         console.log(error);
//         }
// }


// Custom API for A3
export const logging = async(req, res) => {
    // console.log(req.body.username, 'Hello')
    // console.log(req.body.password,'bye')
    // res = req.body.username +" "+req.body.password
    // return res
    let trueFalse = false;
    try {

        const user = await Users.findAll({
            where:{username: req.body.username}
        });
        // console.log(user)
        if(user.length > 0){
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) throw e;
        // res.status(401).json({code : 401});
        const username = user[0].username;
        const userStatus = user[0].status;
        if (!userStatus) throw res.status(403).json({code : 403});
        trueFalse = true
        return trueFalse
        }else{
            // throw res.status(400).json({code : 401 , hello})
            return trueFalse
            }
    }catch(error){
        trueFalse = false
        return trueFalse
        // res.status(411).json({code : 411});
    }
}

export const checkGroup = async(userId, groupName) =>{
    // take in the username to get the usergroup from backend to check against the groupname provided.
    let trueFalse = false;
    // console.log(userId,groupName)
    const user = await Users.findOne({
        attributes:['userGroup'],
        where:{username: userId}
    });
    if(groupName ==  user.userGroup){
        trueFalse = true;
        return trueFalse
    }else{
        trueFalse = false;
        return trueFalse
    }
}

export const createTask = async(req, res) => {
    // const { task_name, task_description,task_plan,task_appAcronym } = req.body;
    let app = []
    let id = ""
    let id2 = ""
    let plan = []
    // console.log(req.body)

    try {
        if(!req.body.username) throw res.status(411).json({code : 411});
        if(!req.body.password) throw res.status(411).json({code : 411});
        if(!req.body.task_name) throw res.status(411).json({code : 411});
        if(!req.body.task_app_acronym) throw res.status(411).json({code : 411});
        
        // console.log(req.body.task_plan.toLowerCase())
        const checking = await logging(req,res);
        //checking whether the loggin is correct
        // but the disabled user still have mild logic error, even though it works
        if(checking){
            // await logging(req,res);
            // console.log("hello")
            app = await App.findAll({
                attributes:['app_Rnumber','app_permitCreate'],
                where:{app_acronym: req.body.task_app_acronym}  
            });
            // check group function
            const checking1 = await checkGroup(req.body.username, app[0].app_permitCreate);
            // console.log(checking1)
            if(checking1){
                plan = await Plan.findAll({
                    attributes:['plan_MVPName'],
                    where:{plan_appAcronym: req.body.task_app_acronym}
                });
                // console.log(plan.findIndex((element) => element.plan_MVPName ===req.body.task_plan) > -1)
                // const isEqual = (element) => element.plan_MVPName ===req.body.task_plan;
                // console.log(plan.findIndex((element) => element.plan_MVPName ===req.body.task_plan))
                // res.json(plan)
                if(app.length > 0 && (plan.findIndex((element) => element.plan_MVPName ===req.body.task_plan.toLowerCase()) > -1 ||req.body.task_plan === "")){
                    await App.update({
                        app_Rnumber: (app[0].app_Rnumber +1)},
                    {where:{app_acronym: req.body.task_app_acronym}});

                    id2 = id.concat(req.body.task_app_acronym.toLowerCase()+ "_" + app[0].app_Rnumber )
                    // console.log(id2)

                    try{
                        await Task.create({
                            task_name: req.body.task_name,
                            task_description: req.body.task_description,
                            task_notes: req.body.username.concat(" state: open @ " + Date()),//try whether if this works anot.
                            task_id: id2,
                            task_plan:req.body.task_plan,
                            task_appAcronym: req.body.task_app_acronym,
                            task_owner: req.body.username,
                            task_creator: app[0].app_permitCreate,// cannot hard code this 
                            task_state: "open",
                            task_createDate:(new Date().toISOString().split("T")[0])
                        });
                        res.status(201).json({code : 201, task_Id : id2});

                    }catch(error){
                        console.log(error)
                    }
                // console.log("bye")
                }else{res.status(404).json({code : 404})}
            }else{throw res.status(512).json({code : 512});}
        }else{res.status(401).json({code : 401})};
    }catch (error) {
        // console.log(error);
        console.log("hello")
    } 
}

export const checkState = async(req,res) =>{
    let arr = ["open","todo","doing","done","close"]
    let trueFalse = false;
    arr.forEach(element=> {
        // console.log(typeof(element))
        if(element === req.body.task_state){
            console.log(element)
            trueFalse = true;
        }
    })
    return trueFalse
}

export const getTaskByState = async(req, res) => {
    // const taskName = req.headers['taskName'];


    try {
        if(!req.body.username) throw res.status(411).json({code : 411});
        if(!req.body.password) throw res.status(411).json({code : 411});
        if(!req.body.task_app_acronym) throw res.status(411).json({code : 411});
        if(!req.body.task_state) throw res.status(411).json({code : 411});

        const checking = await logging(req,res);
        //checking whether the loggin is correct
        // but the disabled user still have mild logic error, even though it works
        if(checking){
            const checking1 = await checkState(req,res);
            //checking whether the state is correct
            if(checking1){
                const task = await Task.findAll({
                    // attributes:['task_id','task_state'],
                    attributes:['task_name','task_description','task_notes','task_id','task_plan','task_appAcronym','task_state','task_creator','task_owner','task_createDate'],
                    where:{
                        task_state: req.body.task_state,
                        task_appAcronym: req.body.task_app_acronym
                    }
                });
                if(task.length > 0){res.json({code : 200, message:task});}
                else{res.json({code : 404});}
            }else{
                return res.status(405).json({code : 405});
            }
        }else{res.status(401).json({code : 401})};
    } catch (error) {
        console.log(error);
    }
}

export const promoteTask2Done = async(req, res) =>{
    let play =[],app = [],shit = [],task =[],inCharge = [],user = [], app1 = [];

    try {
        if(!req.body.username) throw res.status(411).json({code : 411});
        if(!req.body.password) throw res.status(411).json({code : 411});
        if(!req.body.task_Id) throw res.status(411).json({code : 411});

        const checking = await logging(req,res);
        //checking whether the loggin is correct
        // but the disabled user still have mild logic error, even though it works
        if(checking){
            task = await Task.findAll({
                attributes:['task_appAcronym','task_state','task_notes'],
                where:{task_id: req.body.task_Id}
            });
            // console.log("checking")
            // console.log(task)
            // checking whether the required task id is there anot
            if(task.length > 0){
                console.log(task[0].task_state)
                if(task[0].task_state !== "doing") throw res.status(406).json({code : 406});

                app1 = await App.findOne({
                    attributes:['app_permitDoing'],
                    where:{app_acronym: task[0].task_appAcronym}  
                });
                // console.log(app1.app_permitDoing)
                const checking1 = await checkGroup(req.body.username, app1.app_permitDoing);
                if(checking1){
                    await Task.update({
                            task_notes: ("Promoted from doing to done. \nBy " +req.body.username+ "@ " +Date() +"\n\n" + task[0].task_notes),
                            task_owner: req.body.username,
                            task_state: "done"
                        },
                        {
                            where:{task_id:req.body.task_Id}
                        });
                    play = await Users.findOne({
                        attributes:['email'],
                        where:{username: req.body.username}
                    });
                    app = await App.findOne({
                        attributes:['app_permitDone'],
                        where:{app_acronym: task[0].task_appAcronym}  
                    });

                    inCharge = await Users.findAll({
                        attributes:['email'],
                        where:{userGroup: app.app_permitDone}
                    });
                        //place where email start LMAO So Messy fk
                        const shit2 = inCharge.forEach(element => shit.push(element.email))
                        console.log(req.body.task_Id)
                        var transporter = nodemailer.createTransport({
                            host: "smtp.mailtrap.io",
                            port: 2525,
                            auth: {
                                user: "fdb48f7c3a1c3b",
                                pass: "6408d5bf1bef06"
                            },
                            })
                            //rmb remove await for presentation to be faster
                        let info = transporter.sendMail({
                            from:`${play.email}`,
                            to: `${shit}`,
                            subject: `Task ${req.body.task_Id} Completed ✔`, // Subject line
                            text: `${req.body.username} has finish the task: ${req.body.task_Id}  on '${new Date().toUTCString()}'`,
                            html: `${req.body.username} has finish the task: ${req.body.task_Id} on '${new Date().toUTCString()}'`, // html body
                            })
                            console.log("Message sent: %s", info.messageId)
                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                            // Preview only available when sending through an Ethereal account
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                            return res.status(200).json({code : 200});
                // }else{throw res.status(512).json({code : 512});}
                }else{throw res.status(512).json({code : 512});}
            }else{ throw res.status(404).json({code : 404});}
        }else{res.status(401).json({code : 401})};

    } catch (error) {
        console.log(error);
        console.log("hello")
    }
}



// export const getAllUserEmail = async (req, res) => {
//     const {username, appname,taskId} = req.body;
//     let play =[]
//     let app = []
//     let inCharge = []
//     let shit = []
//     try {
//         play = await Users.findAll({
//             attributes:['email'],
//             where:{username: username}
//         });
//         app = await App.findOne({
//             attributes:['app_permitDone'],
//             where:{app_acronym: appname}  
//         });
//         inCharge = await Users.findAll({
//             attributes:['email'],
//             where:{userGroup: app.app_permitDone}
//         });
//         // console.log(typeof(play[0]),play[0].email, "hello") // correct liao 
//         // console.log(typeof(app[0]),app.app_permitDone,"hello")
//     } catch (error) {
//         console.log(error);
//     }
//     finally{
//         const shit2 = inCharge.forEach(element => shit.push(element.email))
//         console.log(taskId)
//         var transporter = nodemailer.createTransport({
//               host: "smtp.mailtrap.io",
//               port: 2525,
//               auth: {
//                 user: "fdb48f7c3a1c3b",
//                 pass: "6408d5bf1bef06"
//               },
//             })
//         let info = await transporter.sendMail({

//             from:`${play[0].email}`,
//             to: `${shit}`,

//             // to:`${play[0].email}`,

//             subject: `Task ${taskId} Completed ✔`, // Subject line

//             text: `${username} has finish the task: ${taskId}  on '${new Date().toUTCString()}'`,

//             html: `${username} has finish the task: ${taskId} on '${new Date().toUTCString()}'`, // html body
//             })
//             console.log("Message sent: %s", info.messageId)
//           // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//           // Preview only available when sending through an Ethereal account
//           console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
//           // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     }
// }


// export const Login = async(req, res) => {
//     try {
//         const user = await Users.findAll({
//             where:{username: req.body.username}
//         });
//         const match = await bcrypt.compare(req.body.password, user[0].password);
//         if(!match) return res.status(401).json({msg: "Wrong Username or Password"});
//         const username = user[0].username;
//         const userStatus = user[0].status;
    
//         const accessToken = jwt.sign({userStatus, username}, process.env.ACCESS_TOKEN_SECRET,{
//             expiresIn: '15s'
//         });
//         const refreshToken = jwt.sign({userStatus, username}, process.env.REFRESH_TOKEN_SECRET,{
//             expiresIn: '1d'
//         });
//         await Users.update({refresh_token: refreshToken},{
//             where:{
//                 username: username
//             }
//         });
//         if (!userStatus) return res.staus(403).json({msg:"Disabled"});
//         res.cookie('refreshToken', refreshToken,{
//             httpOnly: true,
//             maxAge: 24 * 60 * 60 * 1000
//         });
//         res.json({ accessToken });
//     } catch (error) {
//         res.status(411);
//     }
// }

// export const createTask = async(req, res) => {
//     const { taskName, description,plan,acronName,creator,owner, } = req.body;
//     let app = []
//     let task = []
//     let id = ""
//     let id2 = ""

//     try {
//         app = await App.findOne({
//             attributes:['app_Rnumber'],
//             where:{app_acronym: acronName}  
//         });

//         await App.update({
//             app_Rnumber: (app.app_Rnumber +1)
//         },
//         {
//             where:{app_acronym: acronName}
//         });

//         id2 = id.concat(acronName+ "_" + app.app_Rnumber )
//         console.log(id2)

//     } catch (error) {
//         console.log(error);
//         res.json({msg: "Duplicate Task"});
//     }
//      finally{
//         await Task.create({
//             task_name: taskName,
//             task_description: description,
//             task_notes: owner.concat(" state: open @ " + Date()),
//             task_id: id2,
//             task_plan:plan,
//             task_appAcronym: acronName,
//             task_owner: owner,
//             task_creator: creator,// cannot hard code this 
//             task_state: "open",
//             task_createDate:(new Date().toISOString().split("T")[0])
//         });
//         res.json({msg: "Create Successful"});
//     }
// }

export const error = async(req, res) =>{
    res.status(400).json({code : 400});
}