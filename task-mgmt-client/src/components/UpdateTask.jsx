import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/taskservices";
import { toast } from "react-toastify"

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startdate: "",
    enddate: "",
    status: "",
  });

  // Fetch Task
  
  const fetchTask = async () => {
    try {
      const response = await getTaskById(id);
      console.log("FETCHED TASK RESPONSE:", response); // 

    
      const taskData = response?.data?.gettask || response?.gettask;

      if (taskData) {
        setFormData({
          title: taskData.title || "",
          description: taskData.description || "",
         
          startdate: taskData.startdate ? taskData.startdate.split("T")[0] : "",
          enddate: taskData.enddate ? taskData.enddate.split("T")[0] : "",
          status: taskData.status || "",
        });
      } else {
        console.log("Task data not found in response structure");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      alert("Failed to fetch task data");
    }
  };
  useEffect(() => {
    fetchTask();
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateTask(id, formData);
      console.log("UPDATE RESPONSE:", response); 

     
      const isSuccess = response?.success || response?.data?.success;
      const msg = response?.msg || response?.data?.msg || "Task Updated Successfully";

      if (isSuccess) {
        toast.success("Task Updated Successfully");
        navigate("/all-tasks");
      } else {
        toast.error(msg);
      }
    } catch (error) {
      console.log("Update Error:", error);
      toast.error("Update Failed");
    }
  };

  return (
    <div className="container mt-3">
      <div className="card tasks-card p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>

        <h2 className="mb-4 fw-bold" style={{
          background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          ✏️ Update Task
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="form-control bloom-filter-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              className="form-control bloom-filter-input"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                name="startdate"
                className="form-control bloom-filter-input"
                value={formData.startdate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">End Date</label>
              <input
                type="date"
                name="enddate"
                className="form-control bloom-filter-input"
                value={formData.enddate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Status</label>
            <select
              name="status"
              className="form-select bloom-filter-input"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn fw-bold px-4"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(0,0,0,0.15)",
                borderRadius: "12px",
                color: "#555",
              }}
             onClick={() => navigate("/dashboard", { state: { page: "tasks" } })}
            >
              ← Back
            </button>

            <button type="submit" className="btn btn-bloom fw-bold px-4">
              <i className="bi bi-check2-circle me-2"></i>Update Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateTask;