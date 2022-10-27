import express from "express";
import { getUsers, Register, Login, Logout, checkGroup, Update, registerGroup, getGroup, AdminUpdate,AdminGetInfo 
,getApp,appUpdate,getPlan,planUpdate,getTask,taskUpdate,createApp,createPlan,creatingTask,getAllUserEmail,createTask,error,getTaskByState,promoteTask2Done} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();

router.use((req,res,next) => {
    res.locals.currentUser = req.user;
    // Decoding URI
    try {
        decodeURIComponent(req.path)
    }
    // Decode fail if url not encoded properly
    catch(e) {
        return res.status(400).send({code:400})
    }
    next();
});

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.post('/update', Update);
router.get('/adminupdate', AdminGetInfo)
router.post('/adminupdate', AdminUpdate);
router.delete('/logout', Logout);
// router.get('/groups', checkGroup);
//
router.post('/usergroup',registerGroup);
router.get('/usergroup',getGroup);
//
router.get('/appget',getApp);
router.post('/appget',createApp);
router.post('/appupdate',appUpdate);
//
router.get('/planget',getPlan);
router.post('/planget',createPlan);
router.post('/planupdate',planUpdate);
//
router.get('/taskget',getTask);
router.post('/taskget',creatingTask);
router.post('/taskupdate',taskUpdate);
// email 
router.post('/emaildone', getAllUserEmail );
//API
router.post('/api/CreateTask',createTask)
router.post('/api/GetTaskbyState',getTaskByState)
router.post('/api/PromoteTask2Done',promoteTask2Done)
router.post('/api/*', error)



export default router;