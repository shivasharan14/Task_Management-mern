import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import AdminDashboard from "../components/AdminDashboard"; 
import UserDashboard from "../components/UserDashboard"; 
import AllTasks from "../components/AllTasks";
import CreateTask from "../components/CreateTask";
import UpdateTask from "../components/UpdateTask";
import AdminProfile from "../components/AdminProfile";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // 💡 थेट लोकल स्टोरेजमधून रोल वाचूया, जेणेकरून स्टेट बदलण्याची किंवा लोडिंग होण्याची वाट पाहावी लागणार नाही!
  const currentRole = localStorage.getItem("role")?.toLowerCase().trim() || "user";

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        // 💡 आता इथे टाईमिंगचा अजिबात घोळ होणार नाही, ॲडमिनला ॲडमिनच डॅशबोर्ड दिसेल!
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
      <Navbar />

      <div className="d-flex">
        {/* साईडबारला सुद्धा डायरेक्ट रोल पास केला */}
        <Sidebar setPage={setPage} userRole={currentRole} />

        <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "90vh" }}>
          {renderPage()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;