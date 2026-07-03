const {Datatyoes, DataTypes}= require("sequelize")

const {sequelize} = require('../config/db')

const Task = sequelize.define("Task",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
   startdate: {
    type: DataTypes.DATE,
    allowNull: false
},

enddate: {
    type: DataTypes.DATE,
    allowNull: false
},
    status:{
        type:DataTypes.ENUM("Pending","InProgress","completed"),
        allowNull:true,
        defaultValue:"Pending"
    }
},{timestamps:true,tableName:'task'})


module.exports=Task