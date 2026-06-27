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
        <h2 className="fw-bold text-dark m-0">User Dashboard</h2>
        <p className="text-muted m-0">Overview of tasks assigned to you.</p>
      </div>

      {/* 📊 ४ स्टॅट्स कार्ड्स */}
      <div className="row g-3 mb-4">
        {/* Total Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1" style={{ fontSize: "11px" }}>My Total Tasks</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.total}</div>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <i className="bi bi-folder fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-success border-4 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1" style={{ fontSize: "11px" }}>Completed</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.completed}</div>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <i className="bi bi-check-circle fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1" style={{ fontSize: "11px" }}>In Progress</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.inProgress}</div>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
                <i className="bi bi-hourglass-split fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1" style={{ fontSize: "11px" }}>Pending</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.pending}</div>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i className="bi bi-clock fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 टास्क लिस्ट टेबल */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="fw-bold text-dark mb-3">
          <i className="bi bi-list-stars me-2 text-info"></i>My Recent Assigned Tasks
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
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

                  return (
                    <tr key={i}>
                      {/* 💡 क्लीन टास्क ऑब्जेक्ट असल्यामुळे डायरेक्ट डेटा रेंडर होतोय */}
                      <td className="fw-bold text-secondary">{task.title}</td>
                      <td>
                        {task.endDate ? task.endDate.split("T")[0] : task.enddate ? task.enddate.split("T")[0] : "N/A"}
                      </td>
                      <td>
                        <span className={`badge px-2 py-1.5 ${
                          task.status?.toLowerCase().replace(/\s+/g, '') === 'completed' ? 'bg-success' : 
                          task.status?.toLowerCase().replace(/\s+/g, '') === 'inprogress' ? 'bg-info' : 
                          'bg-warning text-dark'
                        }`}>
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