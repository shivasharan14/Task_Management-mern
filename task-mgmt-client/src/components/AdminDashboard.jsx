import { useEffect, useState } from "react";
import { 
  getTotalTaskCount, 
  getTotalCompletedCount, 
  getTotalInprogressCount,
  getAllUsers,
  getAllTask      
} from "../services/taskservices"; 
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminDashboard = ({ setPage }) => {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [totalUsers, setTotalUsers] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);

        
        const [totalRes, completedRes, inprogressRes, usersRes, tasksRes] = await Promise.all([
          getTotalTaskCount(),
          getTotalCompletedCount(),
          getTotalInprogressCount(),
          getAllUsers(),
          getAllTask()
        ]);

       
        const total = totalRes?.totaltask || 0;
        const completed = completedRes?.totalcompletedtask || 0;
        const inProgress = inprogressRes?.totalInprogresstask || 0;
        const pending = total - (completed + inProgress);

        setStats({ total, completed, inProgress, pending: pending < 0 ? 0 : pending });

        const usersCount = usersRes?.alluser?.length || usersRes?.allusers?.length || usersRes?.users?.length || (Array.isArray(usersRes) ? usersRes.length : 0);
        setTotalUsers(usersCount);

       
        const actualTasks = tasksRes?.alltask || tasksRes?.tasks || (Array.isArray(tasksRes) ? tasksRes : []);
        const today = new Date();
        const overdue = actualTasks.filter(task => {
          const endDate = new Date(task.enddate);
          
          return endDate < today && task.status !== "Completed";
        });
        setOverdueTasks(overdue);

      } catch (error) {
        console.error("it is an error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-3">
      
     
      <div className="mb-4">
        <h2 className="fw-bold text-dark m-0">Admin Dashboard</h2>
        <p className="text-muted m-0">Real-time stats fetched directly from your database server.</p>
      </div>

      
      <div className="row g-3 mb-4">
        
        {/* Total Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1" style={{ fontSize: "11px" }}>Total Tasks</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.total}</div>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <i className="bi bi-clipboard-data fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1" style={{ fontSize: "11px" }}>Completed</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.completed}</div>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <i className="bi bi-check-circle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100 py-2">
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
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100 py-2">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1" style={{ fontSize: "11px" }}>Pending</div>
                <div className="h2 mb-0 fw-bold text-dark">{stats.pending}</div>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i className="bi bi-exclamation-triangle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

      </div>

      
      {overdueTasks.length > 0 && (
        <div className="alert alert-danger shadow-sm border-0 mb-4 p-3 rounded-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-alarm-fill text-danger fs-4 me-2"></i>
            <h5 className="alert-heading m-0 fw-bold text-danger">Attention: {overdueTasks.length} Overdue Tasks Need Review!</h5>
          </div>
          <p className="small text-dark mb-2"></p>
          <div className="d-flex flex-wrap gap-2">
            {overdueTasks.map((t, idx) => (
              <span key={idx} className="badge bg-danger p-2 rounded fw-bold">
                {t.title} (Deadline: {new Date(t.enddate).toLocaleDateString()})
              </span>
            ))}
          </div>
        </div>
      )}

     
      <div className="row g-4">
        
        
        <div className="col-12 col-md-7 col-lg-8">
          <div className="card shadow-sm border-0 h-100 p-4 justify-content-center" style={{ backgroundColor: "#ffffff" }}>
            <h4 className="fw-bold mb-2 text-dark">Quick Operations</h4>
            <p className="text-muted mb-4">Easily jump to specific tabs from sidebar to view complete task histories, user management, and profile settings.</p>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-outline-primary fw-bold px-3" onClick={() => setPage("tasks")}>
                <i className="bi bi-list-task me-2"></i>View All Tasks List
              </button>
            </div>
          </div>
        </div>

       
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card shadow-sm border-0 text-center py-4 px-3 h-100" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
            <div className="text-primary mb-2">
              <i className="bi bi-people-fill" style={{ fontSize: "45px" }}></i>
            </div>
            <h5 className="fw-bold mb-1 text-dark">Team Overview</h5>
            <p className="text-muted small px-2">Total registered staff members available to handle tasks.</p>
            <div className="display-4 fw-bold text-primary my-2">{totalUsers}</div>
            <div>
              <span className="badge bg-dark px-3 py-2 rounded-pill small">Active Employees</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;