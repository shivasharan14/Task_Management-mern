import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import AdminDashboard from "../components/AdminDashboard"; 
import UserDashboard from "../components/UserDashboard"; 
import AllTasks from "../components/AllTasks";
import CreateTask from "../components/CreateTask";
import UpdateTask from "../components/UpdateTask";

import AdminProfile from "../components/AdminProfile";
import { ThemeContext } from "../components/context/ThemeContext";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const themeClass = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";

 
  const currentRole = localStorage.getItem("role")?.toLowerCase().trim() || "user";

  const renderPage = () => {
    switch (page) {
      case "dashboard":
       
        if (currentRole === "admin") {
          return <AdminDashboard setPage={setPage} />;
        } else {
          return <UserDashboard />;
        }

      case "tasks":
        return <AllTasks />;

      case "create":
        return <CreateTask />;

      case "update":
        return <UpdateTask />;
      
      case "profile":
        return <AdminProfile />;

      default:
        return (
          <div className="alert alert-danger">
            Page Not Found
          </div>
        );
    }
  };

  return (
    <>
   <div className={`card shadow-sm p-2 ${theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"}`}>
      <Navbar />

      <div className="d-flex">
        <Sidebar setPage={setPage} userRole={currentRole} theme={theme}/>

       
        <div className="flex-grow-1 p-4" style={{ 
            backgroundColor: theme === "dark" ? "#212529" : "#f8f9fa", 
            minHeight: "90vh" 
        }}>
          {renderPage()}
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;