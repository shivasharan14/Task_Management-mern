import { useState } from "react";
import { changePasswordAPI } from "../services/userservices";
import { toast } from "react-toastify";

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      const res = await changePasswordAPI({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      toast.success(res.msg || "Password changed successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to change password");
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content shadow-lg"
          style={{ borderRadius: "18px", overflow: "hidden", border: "none" }}
        >
          <div className="modal-header bloom-modal-header text-white">
            <h5 className="modal-title">Change Password</h5>
            <button
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  className="form-control bloom-filter-input"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control bloom-filter-input"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control bloom-filter-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-bloom fw-bold px-4">
                  Update Password
                </button>
                <button
                  type="button"
                  className="btn fw-bold px-4"
                  style={{
                    background: "transparent",
                    border: "1.5px solid rgba(0,0,0,0.15)",
                    borderRadius: "12px",
                    color: "#555",
                  }}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;