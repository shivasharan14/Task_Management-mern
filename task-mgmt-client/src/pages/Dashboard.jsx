
import { useContext, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import AdminDashboard from "../components/AdminDashboard"; 
import UserDashboard from "../components/UserDashboard"; 
import AllTasks from "../components/AllTasks";
import CreateTask from "../components/CreateTask";
import UpdateTask from "../components/UpdateTask";
import { useNavigate, useLocation } from "react-router-dom";

import AdminProfile from "../components/AdminProfile";
import { ThemeContext } from "../components/context/ThemeContext";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
const [page, setPage] = useState(location.state?.page || "dashboard");
  const { theme } = useContext(ThemeContext);
   const [sidebarOpen, setSidebarOpen] = useState(false);

  
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
      <div
        className={`card shadow-sm ${theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"}`}
        style={{ border: "none", borderRadius: 0, overflow: "hidden" }}
      >
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="d-flex position-relative">
          {sidebarOpen && (
            <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
          )}

          <Sidebar
            setPage={setPage}
            userRole={currentRole}
            theme={theme}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div
            className="flex-grow-1 p-4"
            style={{
              background: theme === "dark"
                ? "#1a1a1a"
                : "linear-gradient(180deg, #faf5ff 0%, #fdf2f8 100%)",
              minHeight: "90vh",
            }}
          >
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;