import axiosInstance from "../api/axiosInstance";
import axios from "axios";
// Create Task
export const createTask = async (data) => {
  const response = await axiosInstance.post("/task/create", data);
  return response;
};

// Get All Tasks
export const getAllTask = async () => {
  const response = await axiosInstance.get("/task/getall");
  return response.data;
};

// Get Task By ID
export const getTaskById = async (id) => {
  const response = await axiosInstance.get(`/task/getTask/${id}`);
  return response.data;
};

// Update Task
export const updateTask = async (id, data) => {
  const response = await axiosInstance.put(`/task/update/${id}`, data);
  return response.data;
};

 export const updatestatus =async(id,data) =>{
  const response = await axiosInstance.patch(`/task/updateStatus/${id}`,data);
  return response.data;
}



export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/task/task/${id}`); //
  return response.data; // 
};


export const getTasksByMonth = async (year, month) => {
  
  const response = await axiosInstance.get(`/task/gettaskmonth?year=${year}&month=${month}`);
  return response.data; 
};


export const assignTaskToUserAPI = async (userID, taskID) => {
  try {
    
    const response = await axiosInstance.post("/assign/assign-task", { userID, taskID });
    return response.data;
  } catch (error) {
    console.error("Error assigning task:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    
    const response = await axiosInstance.get("/user/getall"); 
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};



export const getTotalTaskCount = async () => {
  try {
    const response = await axiosInstance.get("/task/totaltk");
    return response.data; 
  } catch (error) {
    console.error("Error fetching total task count:", error);
    throw error;
  }
};


export const getTotalCompletedCount = async () => {
  try {
    const response = await axiosInstance.get("/task/totalct");
    return response.data; 
  } catch (error) {
    console.error("Error fetching completed count:", error);
    throw error;
  }
};


export const getTotalInprogressCount = async () => {
  try {
    const response = await axiosInstance.get("/task/totalIt");
    return response.data; 
  } catch (error) {
    console.error("Error fetching inprogress count:", error);
    throw error;
  }
};


export const getTasksByUserAPI = async (userId) => {
  const token = localStorage.getItem("token");
  
  const res = await axiosInstance.get(`/assign/get-assign-task/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  });
  return res.data;
};