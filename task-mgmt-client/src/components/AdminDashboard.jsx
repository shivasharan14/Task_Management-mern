import { useEffect, useState } from "react";
import { useContext } from "react";
import {
  getTotalTaskCount,
  getTotalCompletedCount,
  getTotalInprogressCount,
  getAllUsers,
  getAllTask,
} from "../services/taskservices";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeContext } from "./context/ThemeContext";

const AdminDashboard = ({ setPage }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);

        const [totalRes, completedRes, inprogressRes, usersRes, tasksRes] =
          await Promise.all([
            getTotalTaskCount(),
            getTotalCompletedCount(),
            getTotalInprogressCount(),
            getAllUsers(),
            getAllTask(),
          ]);

        const total = totalRes?.totaltask || 0;
        const completed = completedRes?.totalcompletedtask || 0;
        const inProgress = inprogressRes?.totalInprogresstask || 0;
        const pending = total - (completed + inProgress);

        setStats({
          total,
          completed,
          inProgress,
          pending: pending < 0 ? 0 : pending,
        });

        const usersCount =
          usersRes?.alluser?.length ||
          usersRes?.allusers?.length ||
          usersRes?.users?.length ||
          (Array.isArray(usersRes) ? usersRes.length : 0);

        setTotalUsers(usersCount);

        const allUsers =
          usersRes?.alluser ||
          usersRes?.allusers ||
          usersRes?.users ||
          (Array.isArray(usersRes) ? usersRes : []);

        setUsers(allUsers);

        const actualTasks =
          tasksRes?.alltask ||
          tasksRes?.tasks ||
          (Array.isArray(tasksRes) ? tasksRes : []);
        const today = new Date();
        const overdue = actualTasks.filter((task) => {
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-2">
      <div className="mb-3">
        <h2 className="fw-bold m-0" style={{
          background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          🌸 Admin Dashboard
        </h2>
        <p className={`m-0 ${theme === "dark" ? "text-secondary" : "text-muted"}`}>
          Real-time stats fetched directly from your database server.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-total">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
            <i className="bi bi-clipboard-data stat-icon"></i>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-done">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
            <i className="bi bi-check-circle-fill stat-icon"></i>
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
            <i className="bi bi-exclamation-triangle-fill stat-icon"></i>
          </div>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="mb-4 p-3 rounded-4" style={{
          background: "linear-gradient(90deg, rgba(220,53,69,0.08), rgba(255,138,61,0.08))",
          border: "1px solid rgba(220,53,69,0.25)",
        }}>
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-alarm-fill text-danger fs-4 me-2"></i>
            <h5 className="m-0 fw-bold text-danger">
              Attention: {overdueTasks.length} Overdue Tasks Need Review!
            </h5>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {overdueTasks.map((t, idx) => (
              <span key={idx} className="badge p-2 rounded-pill fw-bold" style={{
                background: "linear-gradient(90deg, #dc3545, #ff8a3d)",
                color: "#fff",
              }}>
                {t.title} (Deadline: {new Date(t.enddate).toLocaleDateString()})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-md-7 col-lg-8">
          <div className="card bloom-table-card h-100 p-4 justify-content-center">
            <h4 className="fw-bold mb-2 text-dark">Quick Operations</h4>
            <p className="text-muted mb-4">
              Easily jump to specific tabs from sidebar to view complete task
              histories, user management, and profile settings.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-bloom px-4"
                onClick={() => setPage("tasks")}
              >
                <i className="bi bi-list-task me-2"></i>View All Tasks List
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5 col-lg-4">
          <div
            className="card bloom-table-card text-center py-4 px-3 h-100"
            style={{
              background: "linear-gradient(160deg, #f3e8ff 0%, #ffe4f3 100%)",
            }}
          >
            <div className="mb-2" style={{ color: "#7b2ff7" }}>
              <i className="bi bi-people-fill" style={{ fontSize: "45px" }}></i>
            </div>
            <h5 className="fw-bold mb-1 text-dark">Team Overview</h5>
            <p className="text-muted small px-2">
              Total registered staff members available to handle tasks.
            </p>
            <div className="display-4 fw-bold my-2" style={{
              background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {totalUsers}
            </div>
            <div className="dropdown">
              <span
                className="badge px-3 py-2 rounded-pill small dropdown-toggle"
                style={{
                  background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
                  color: "#fff",
                  cursor: "pointer",
                }}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Active Users
              </span>

              <ul className="dropdown-menu p-2" style={{ minWidth: "250px" }}>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <li key={user.id} className="dropdown-item">
                      <strong>{user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item text-muted">No users found</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;