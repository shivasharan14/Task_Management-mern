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
    <div className="card shadow">
      <div className="card-body">
        <h2 className="mb-4">Create Task</h2>

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

          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;