const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

const { connectDb } = require('./config/db');
const taskRoutes = require('./Routes/taskroute');
const userRoutes = require ('./Routes/userroute');
const assignRoutes = require('./Routes/assigntaskroute');

app.use(express.json());
app.use(cors(
    {
    origin: "http://localhost:5173",
  }
));

connectDb();

app.use('/task', taskRoutes);

app.use('/user',userRoutes);

app.use('/assign', assignRoutes);

app.use('/uploads', express.static("uploads"))

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});