const express = require('express')

const router = express.Router();

const { AssignTaskToUser, getAllassigntask, getTaskWithUser, getTasksByUser } = require('../controllers/asssigntaskcontroller');
const { admin, auth } = require('../middleware/auth');

router.post('/assign-task',auth,admin, AssignTaskToUser );

router.get('/get-assign-task/:id',auth,getTasksByUser);

 router.get('/get-taskwith-user/:id',auth,admin,getTaskWithUser)

router.get('/getallassigntask',auth,admin,getAllassigntask)

module.exports=router