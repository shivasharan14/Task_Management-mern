const { sequelize } = require("../config/db");
const Task = require('../models/taskmodel');
const { Op } = require("sequelize");

// १. नवीन टास्क तयार करणे
async function createTask(req, res) {
    console.log(req.body);
    const { title, description, startdate, enddate } = req.body;
    try {
        if (!title || !description || !startdate || !enddate) {
            return res.status(400).send({ msg: "all fields are required", success: false });
        }

        if (new Date(enddate) < new Date(startdate)) {
            return res.status(400).send({
                msg: "Start date cannot be greater than end date",
                success: false
            });
        }
        const newTask = await Task.create({ title, description, startdate, enddate });

        console.log(newTask);
        res.status(201).send({
            msg: "Task created successfully",
            success: true,
            task: newTask
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "server error", success: false });
    }
}

// २. आयडीनुसार टास्क शोधणे
async function getTaskByID(req, res) {
    const ID = req.params.id;
    console.log(ID);
    try {
        const gettask = await Task.findByPk(ID);
        if (!gettask) {
            return res.status(404).send({ msg: "not present task", success: false });
        }
        res.status(200).send({ gettask: gettask, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "server error", success: false });
    }
}

// ३. टास्कचा स्टेटस अपडेट करणे
async function updateStatus(req, res) {
    const id = req.params.ID;
    const status = req.body.status;
    try {
        const statuArr = ["Pending", "InProgress", "Completed"];
        if (!statuArr.includes(status)) {
            return res.status(400).send({ msg: "Data not found", success: false });
        }
        const taskForStatusUpdate = await Task.findByPk(id);
        
        if (!taskForStatusUpdate) {
            return res.status(400).send({ msg: "Task not found", success: false });
        }

        await taskForStatusUpdate.update({ status: status });
        res.status(200).send({ msg: "Task status updated successfully", success: true });

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Server error", success: false });
    }
}

// ४. सर्व टास्कची लिस्ट मिळवणे
async function getAllTask(req, res) {
    try {
        const alltask = await Task.findAll();
        res.status(200).send({ alltask: alltask, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "server error", success: false }); // 👈 इथे req.status होतं, ते res केलं
    }
}

// ५. टास्कचे इतर डिटेल्स अपडेट करणे
async function updateitem(req, res) {
    const ID = req.params.id;
    try {
        const task = await Task.findByPk(ID);
        
        if (!task) {
            return res.status(404).send({ msg: "task not found", success: false });
        }

        await task.update(req.body);
        res.status(200).send({ msg: "task is updated successfully", success: true, task: task });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "server error", success: false });
    }
}

// ६. टास्क डिलीट करणे
async function deletestatus(req, res) {
    const ID = req.params.id;
    try {
        const task = await Task.findByPk(ID);

        if (!task) {
            return res.status(404).send({
                msg: "task not found",
                success: false
            });
        }

        await task.destroy();
        res.status(200).send({
            msg: "task is deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "server error", success: false });
    }
}

// ७. फक्त Completed झालेले टास्क आणणे
async function getcompletedTask(req, res) {
    try {
        const completedtask = await Task.findAll({
            where: {
                status: 'Completed' // 👈 कॅपिटल 'C' केला, तुझ्या व्हॅलिडेशननुसार
            }
        });
   
        console.log(completedtask);
        res.status(200).send({ completedtask: completedtask, success: true });
        
    } catch (error) {
        console.log("Backend Error:", error);
        res.status(500).send({ msg: 'server error', success: false });
    }
}

// ८. फक्त Inprogress असलेले टास्क आणणे
async function getInprogressTask(req, res) {
    try {
        const Inprogresstask = await Task.findAll({
            where: {
                status: 'Inprogress' // 👈 कॅपिटल 'I' केला
            }
        });
   
        console.log(Inprogresstask); // 👈 टायपो फिक्स केला
        res.status(200).send({ Inprogresstask: Inprogresstask, success: true });
        
    } catch (error) {
        console.log("Backend Error:", error);
        res.status(500).send({ msg: 'server error', success: false });
    }
}

// ९. एकूण टास्कची संख्या मोजणे
async function Totaltask(req, res) {
    try {
        const totaltask = await Task.count();
        console.log(totaltask);
        res.status(200).send({ totaltask: totaltask, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'server error', success: false });
    }
}

// १०. एकूण Completed टास्क मोजणे
async function TotalCompletedTask(req, res) {
    try {
        const totalcompletedtask = await Task.count({ where: { status: 'Completed' } });
        console.log(totalcompletedtask);
        res.status(200).send({ totalcompletedtask: totalcompletedtask, success: true }); // 👈 ५०० ऐवजी २०० स्टेटस केला
    } catch (error) {
       console.log(error);
       res.status(500).send({ msg: 'server error', success: false }); 
    }
} 

// ११. एकूण Inprogress टास्क मोजणे
async function TotalInprogressTask(req, res) {
    try {
        const totalInprogresstask = await Task.count({ where: { status: 'Inprogress' } });
        console.log(totalInprogresstask);
        res.status(200).send({ totalInprogresstask: totalInprogresstask, success: true }); // 👈 ५०० ऐवजी २०० स्टेटस केला
    } catch (error) {
       console.log(error);
       res.status(500).send({ msg: 'server error', success: false }); 
    }
} 

// १२. महिन्यानुसार टास्क फिल्टर करणे
async function getTasksBySelectedMonth(req, res) {
    try {
        const { year, month } = req.query;

        if (!year) {
            return res.status(400).json({ msg: "Year is required", success: false });
        }

        let startDate, endDate;

        if (month) {
            startDate = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
            const lastDay = new Date(year, month, 0).getDate(); 
            endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay} 23:59:59`; 
        } else {
            startDate = `${year}-01-01 00:00:00`;
            endDate = `${year}-12-31 23:59:59`;
        }

        console.log("Searching between:", startDate, "AND", endDate); 

        const tasks = await Task.findAll({
            where: {
                startdate: {
                    [Op.between]: [startDate, endDate] 
                }
            }
        });

        return res.status(200).json({ tasks, success: true });

    } catch (error) {
        console.error("Month/Year Filter Error:", error);
        return res.status(500).json({ msg: "Server error", success: false });
    }
}

module.exports = {
    createTask,
    getTaskByID,
    getAllTask,
    updateitem,
    deletestatus,
    getcompletedTask,
    getInprogressTask,
    Totaltask,
    TotalCompletedTask,
    TotalInprogressTask,
    getTasksBySelectedMonth,
    updateStatus
};