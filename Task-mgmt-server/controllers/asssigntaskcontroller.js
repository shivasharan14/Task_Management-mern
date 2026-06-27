 const {sequelize} = require('../config/db')
const AssignTask = require('../models/assigntaskmodel')

 const Task = require('../models/taskmodel')

 const User = require('../models/usermodel')


 
 async function AssignTaskToUser(req,res){
    const {userID,taskID} = req.body
    try {
         const user = await User.findByPk(userID)
        const task = await Task.findByPk(taskID)

  
    if(!userID || !taskID){
        return res.status(400).send({msg:"user not found" ,success:false})
    }

    const exists = await AssignTask.findOne({
            where: { userID, taskID }
        });


        if (exists) {
            return res.status(400).send({
                msg: "Task already assigned to this user",
                success: false
            });
        }


    const newassigntask =  await AssignTask.create({userID:userID, taskID:taskID})

    res.status(200).send({newaasigntask:newassigntask,msg:"task assigned successfuly",success:true})
    } catch (error) {
        res.status(500).send({msg:'server error' ,success: false})
    }

 }

 async function  getAllassigntask(req,res){
    try {
        const getallassigntask = await AssignTask.findAll();
        res.status(200).send({getallassigntask:getallassigntask,success:true})
    } catch (error) {
        
        res.status(500).send({msg:"server error ", success:false})
    }
 }

 async function getTaskWithUser(req,res){
    const taskid= req.params.id
    try {
        const  tkwithuser= await AssignTask.findAll({
            where:{taskID:taskid},
            include:[
                {
                    model:User,
                    attributes:['id','email','name']
                },
                {
                    model:Task
                }
            ]
        })
        res.status(200).send({tkwithuser:tkwithuser,success:true})
        
    } catch (error) {
        res.status(500).send({msg:"server error ",success:false})
    }
 }


 async function getTasksByUser(req, res) {
    const userid = req.params.id;
    try {
        const assignedtask = await AssignTask.findAll({
            where: { userID: userid },
            include: [{
                model: Task,
                
                attributes: ['id', 'title', 'startdate', 'enddate', 'status'] 
            }]
        });

        
        const cleanTasks = assignedtask
            .filter(item => item.Task !== null) 
            .map(item => item.Task);

        res.status(200).send({ tasks: cleanTasks, success: true });
    } catch (error) {
        console.error("Error in getTasksByUser:", error);
        res.status(500).send({ msg: "server error", success: false });
    }
}




 module.exports={AssignTaskToUser,
    getAllassigntask,
    getTaskWithUser,
    getTasksByUser

 }