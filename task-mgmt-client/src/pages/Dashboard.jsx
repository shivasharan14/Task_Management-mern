import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import AllTasks from "../components/AllTasks";
import CreateTask from "../components/CreateTask";
import UpdateTask from "../components/UpdateTask";
import AdminProfile from "../components/AdminProfile";
import { ThemeContext } from "../components/context/ThemeContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("dashboard");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const currentRole = localStorage.getItem("role")?.toLowerCase().trim() || "user";

  const handleEditTask = (taskId) => {
    setSelectedTaskId(taskId);
    setPage("update");
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        if (currentRole === "admin") {
          return <AdminDashboard setPage={setPage} />;
        } else {
          return <UserDashboard />;
        }

      case "tasks":
        return <AllTasks setPage={setPage} onEditTask={handleEditTask} />;

      case "create":
        return <CreateTask />;

      case "update":
        return <UpdateTask taskId={selectedTaskId} setPage={setPage} />;

      case "profile":
        return <AdminProfile />;

      default:
        return <div className="alert alert-danger">Page Not Found</div>;
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