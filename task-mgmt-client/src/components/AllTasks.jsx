import { useEffect, useState } from "react";
import { getAllTask, deleteTask, getTasksByMonth, getAllUsers, assignTaskToUserAPI, getTasksByUserAPI } from "../services/taskservices";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios"; 

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); 
  const [selectedYear, setSelectedYear] = useState("2026"); 
  const [selectedStatus, setSelectedStatus] = useState("All"); 
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role") || "user";
  const userId = localStorage.getItem("userId");

  const [users, setUsers] = useState([]); 
  const [showModal, setShowModal] = useState(false); 
  const [activeTaskId, setActiveTaskId] = useState(null); 
  const [selectedUserId, setSelectedUserId] = useState([]); 

  const fetchTasks = async () => {
    try {
      if (userRole === "user") {
        if (!userId) return;
        const res = await getTasksByUserAPI(userId);
        const taskData = res.tasks || res.assignedtask || (Array.isArray(res) ? res : []);
        setTasks(taskData);
      } else {
        const res = await getTasksByMonth(selectedYear, selectedMonth);
        setTasks(res.tasks || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedMonth, selectedYear]);

  
  const filteredTasks = (tasks || []).map(t => (t.Task ? t.Task : t)).filter(task => {
    if (selectedStatus === "All") return true;
    const currentStatus = (task.status || "").toLowerCase().trim();
    const targetStatus = selectedStatus.toLowerCase().trim();
    return currentStatus === targetStatus;
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/task/update-status/${taskId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task status updated successfully! 🎉");
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleOpenAssignModal = async (taskId) => {
    setActiveTaskId(taskId);
    setShowModal(true);
    try {
      const res = await getAllUsers();
      if (Array.isArray(res)) {
        setUsers(res);
      } else if (res && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res && res.users) {
        setUsers(res.users);
      } else if (res && res.alluser) {
        setUsers(res.alluser);
      } else if (res && res.getalluser) {
        setUsers(res.getalluser);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading members:", error);
      alert("Failed to load team members");
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedUserId || selectedUserId.length === 0) {
      alert("Please select at least one member first!");
      return;
    }
    try {
      const promises = selectedUserId.map(userId => 
        assignTaskToUserAPI(userId, activeTaskId)
      );
      await Promise.all(promises);
      alert("Tasks assigned successfully to all selected members! 🎉");
      setShowModal(false);
      setSelectedUserId([]); 
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Something went wrong! Some users might already be assigned.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure to delete this task?");
      if (!confirmDelete) return;

      const res = await deleteTask(id);
      if (res && (res.success || res.status === 200 || res.data?.success)) {
        alert("Task deleted successfully");
        fetchTasks(); 
      } else {
        alert(res?.msg || "Failed to delete task");
      }
    } catch (error) {
      alert("Delete failed: " + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className="card shadow position-relative">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">{userRole === "admin" ? "All Tasks" : "My Assigned Tasks"}</h2>
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm" 
              style={{ width: "140px" }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            {userRole === "admin" && (
              <>
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: "160px" }}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: "90px" }}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </>
            )}
          </div>
        </div>

        {userRole === "admin" ? (
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <tr key={task.id || task._id || index}>
                    <td>{index + 1}</td> 
                    <td className="fw-bold">{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.startdate?.split("T")[0] || task.startDate?.split("T")[0]}</td>
                    <td>{task.enddate?.split("T")[0] || task.endDate?.split("T")[0]}</td>
                    <td>
                      {task.status?.toLowerCase() === "completed" ? (
                        <span className="badge bg-success px-2 py-1.5">Completed</span>
                      ) : task.status?.toLowerCase() === "inprogress" || task.status?.toLowerCase() === "in progress" ? (
                        <span className="badge bg-info px-2 py-1.5">In Progress</span>
                      ) : (
                        <span className="badge bg-warning text-dark px-2 py-1.5">Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center gap-3" style={{ fontSize: "18px" }}>
                        <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => handleOpenAssignModal(task.id || task._id)}><i className="bi bi-person-plus-fill"></i></span>
                        <span className="text-warning" style={{ cursor: "pointer" }} onClick={() => navigate(`/dashboard/task/update/${task.id || task._id}`)}><i className="bi bi-pencil-square"></i></span>
                        <span className="text-danger" style={{ cursor: "pointer" }} onClick={() => handleDelete(task.id || task._id)}><i className="bi bi-trash3-fill"></i></span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center text-muted py-4">No Tasks Found! ❌</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="row g-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={task.id || task._id || index}>
                  <div className="card h-100 border-0 shadow-sm border-top border-4 border-info">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-dark mb-0">{task.title}</h5>
                        <span className={`badge ${task.status?.toLowerCase() === "completed" ? "bg-success" : task.status?.toLowerCase() === "inprogress" || task.status?.toLowerCase() === "in progress" ? "bg-info" : "bg-warning text-dark"}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="card-text text-muted small mb-3" style={{ minHeight: "40px" }}>{task.description}</p>
                      <div className="row g-2 mb-3 bg-light p-2 rounded small text-secondary">
                        <div className="col-6"><i className="bi bi-calendar-event me-1"></i> Start: {task.startdate?.split("T")[0] || task.startDate?.split("T")[0] || "N/A"}</div>
                        <div className="col-6"><i className="bi bi-calendar-check me-1"></i> End: {task.enddate?.split("T")[0] || task.endDate?.split("T")[0] || "N/A"}</div>
                      </div>
                      <div className="mt-3 border-top pt-2">
                        <label className="form-label text-xs fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>Update My Status:</label>
                        <select className="form-select form-select-sm" value={task.status || "Pending"} onChange={(e) => handleStatusChange(task.id || task._id, e.target.value)}>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted py-5"><h5>No tasks assigned to you! 🎉</h5></div>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Assign Task to Member</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-bold mb-2">Select Team Members:</label>
                <div className="border rounded p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {users && users.length > 0 ? (
                    users.map((user) => {
                      const isChecked = selectedUserId.includes(user.id);
                      return (
                        <div key={user.id} className="form-check mb-2 d-flex align-items-center gap-2">
                          <input type="checkbox" className="form-check-input" id={`user-${user.id}`} style={{ width: "18px", height: "18px", cursor: "pointer" }} checked={isChecked} onChange={() => { if (isChecked) { setSelectedUserId(selectedUserId.filter((id) => id !== user.id)); } else { setSelectedUserId([...selectedUserId, user.id]); } }} />
                          <label className="form-check-label m-0" htmlFor={`user-${user.id}`} style={{ cursor: "pointer", fontSize: "15px" }}><strong>{user.name}</strong> <span className="text-muted">({user.email})</span></label>
                        </div>
                      );
                    })
                  ) : (<p className="text-muted m-0 text-center">No members found</p>)}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-success fw-bold" onClick={handleAssignSubmit}>Save Assignment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTasks;