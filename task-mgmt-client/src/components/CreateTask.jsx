import { useState } from "react";
import { createTask } from "../services/taskservices";
import { toast } from "react-toastify";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startdate: "",
    enddate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createTask(formData);

      toast.success(res.data.msg);

      setFormData({
        title: "",
        description: "",
        startdate: "",
        enddate: "",
      });
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="card tasks-card" style={{ maxWidth: "600px" }}>
      <div className="card-body p-4">
        <h2 className="mb-4 fw-bold" style={{
          background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          ➕ Create Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="form-control bloom-filter-input"
              placeholder="e.g. Design homepage mockup"
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
              placeholder="Add task details..."
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

          <button type="submit" className="btn btn-bloom fw-bold px-4 mt-2">
            <i className="bi bi-check2-circle me-2"></i>Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;