import { useEffect, useState } from "react";
import { getTasksByUserAPI } from "../services/taskservices";
import "bootstrap-icons/font/bootstrap-icons.css";

const UserDashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId"); 
        
        if (!userId) {
          console.error("User ID not found! Please log in again.");
          setLoading(false);
          return;
        }

        // 💡 १. बॅकएंड एपीआय वरून आरवचा डेटा आणला
        const res = await getTasksByUserAPI(userId);
        console.log("📌 BACKEND RESPONDED WITH:", res); 
        
        // 💡 २. तुझ्या कंट्रोलरमधील 'tasks' की नुसार अरे सुरक्षित घेतला
        const rawTasks = res?.tasks || []; 
        
        let total = rawTasks.length;
        let completed = 0;
        let inProgress = 0;
        let pending = 0;

        // 💡 ३. स्टॅट्स मोजणी (आता डायरेक्ट task.status वरून चालणार)
        rawTasks.forEach(task => {
          if (task && task.status) {
            const status = task.status.toLowerCase().replace(/\s+/g, '');
            
            if (status === "completed") {
              completed++;
            } else if (status === "inprogress") {
              inProgress++;
            } else {
              pending++;
            }
          } else {
            pending++;
          }
        });

        setStats({ total, completed, inProgress, pending });
        setMyTasks(rawTasks); // क्लीन टास्क लिस्ट स्टेटमध्ये सेट केली
      } catch (error) {
        console.error("Error loading user dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-info" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

 return (
    <div className="container-fluid px-4 py-3">

      {/* हेडर */}
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{
          background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          🌸 My Dashboard
        </h2>
        <p className="text-muted m-0">Overview of tasks assigned to you.</p>
      </div>

      {/* 📊 ४ स्टॅट्स कार्ड्स */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-total">
            <div className="stat-label">My Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
            <i className="bi bi-folder stat-icon"></i>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-done">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
            <i className="bi bi-check-circle stat-icon"></i>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-progress">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
            <i className="bi bi-hourglass-split stat-icon"></i>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
            <i className="bi bi-clock stat-icon"></i>
          </div>
        </div>
      </div>

      {/* 📋 टास्क लिस्ट टेबल */}
      <div className="card bloom-table-card p-4">
        <h5 className="fw-bold text-dark mb-3">
          <i className="bi bi-list-stars me-2" style={{ color: "#f107a3" }}></i>My Recent Assigned Tasks
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 bloom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.length > 0 ? (
                myTasks.map((task, i) => {
                  if (!task) return null;

                  const statusKey = task.status?.toLowerCase().replace(/\s+/g, '');
                  const badgeClass =
                    statusKey === 'completed' ? 'badge-bloom-done' :
                    statusKey === 'inprogress' ? 'badge-bloom-progress' :
                    'badge-bloom-pending';

                  return (
                    <tr key={i}>
                      <td className="fw-bold text-secondary">{task.title}</td>
                      <td>
                        {task.endDate ? task.endDate.split("T")[0] : task.enddate ? task.enddate.split("T")[0] : "N/A"}
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 rounded-pill ${badgeClass}`}>
                          {task.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No tasks assigned to you yet. 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};



export default UserDashboard;