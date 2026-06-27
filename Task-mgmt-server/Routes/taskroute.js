const express = require('express');
const router = express.Router();

// import controllers
const {
    createTask,
    getTaskByID,
    getAllTask,
    // updateStatus,
    deletestatus,
    updateitem,
    getcompletedTask,
    getInprogressTask,
    Totaltask,
    TotalCompletedTask,
    TotalInprogressTask,
    getTasksBySelectedMonth,
    updateStatus
} = require('../Controllers/taskcontroller');
const { auth, admin } = require('../middleware/auth');

// routes
router.post('/create',auth,admin, createTask);

router.get('/getall',auth, getAllTask);

router.patch('/updateStatus/:ID', auth,updateStatus)

router.get('/getTask/:id',auth, getTaskByID);

router.put('/update/:id',auth,admin, updateitem);

router.delete("/task/:id", auth,admin,deletestatus);

router.get('/getcompletetask',getcompletedTask);

router.get('/getInprogresstask',auth,getInprogressTask);

router.get('/totaltk',auth,Totaltask);

router.get('/totalct',auth,TotalCompletedTask)

router.get('/totalIt',auth,TotalInprogressTask)

router.get('/gettaskmonth',auth,getTasksBySelectedMonth)

module.exports = router;