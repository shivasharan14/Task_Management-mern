import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/taskservices";

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
        alert("Task Updated Successfully");
        navigate("/all-tasks");
      } else {
        alert(msg);
      }
    } catch (error) {
      console.log("Update Error:", error);
      alert("Update Failed");
    }
  };

  return (
    <div className="container mt-3">
      <div className="card shadow p-4">

        <h2 className="mb-4">Update Task</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startdate"
              className="form-control"
              value={formData.startdate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="enddate"
              className="form-control"
              value={formData.enddate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>

          <button
            type="submit"
            className="btn btn-warning"
          >
            Update Task
          </button>

        </form>
      </div>
    </div>
  );
};

export default UpdateTask;