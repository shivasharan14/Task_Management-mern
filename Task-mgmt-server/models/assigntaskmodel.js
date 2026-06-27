const { DataTypes } = require('sequelize')
const {sequelize} =  require('../config/db.js')
const User = require('./usermodel.js')
const Task = require('./taskmodel.js')


const AssignTask=sequelize.define("AssignTask",{
id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
},
userID:{
type:DataTypes.INTEGER,
allowNull:false,
references:{
model:'users',
key:'id'
},
},

taskID:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
        model:'task',
        key:'id'
    },
},
},
{timestamps:true,tableName:"assign_task"}
)
// one user can have many assigned task
User.hasMany(AssignTask,{foreignKey:"userID"})
AssignTask.belongsTo(User,{foreignKey:"userID"})

// one task has multiple user 
Task.hasMany(AssignTask,{foreignKey:"taskID"})
AssignTask.belongsTo(Task,{foreignKey:"taskID"})


module.exports=AssignTask