import axiosInstance from "../api/axiosInstance";

// Register User
export const registerUser = async (data) => {
  const response = await axiosInstance.post("/user/register", data);
  return response.data;
};

// Login User
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};

// Get Logged In User Info
export const getUserInfo = async (id) => {
  const response = await axiosInstance.get(`/user/userinfo/${id}`);
  return response.data;
};