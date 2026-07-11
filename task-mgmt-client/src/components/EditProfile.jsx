import { useState } from "react";
import axiosInstance from "../api/axiosinstance";
import { toast } from "react-toastify";

const EditProfile = ({ adminData, onCancel, onSuccess }) => {
  // adminData मधून जुना डेटा फॉर्ममध्ये भरून घेतला (Pre-fill)
  const [formData, setFormData] = useState({ 
    name: adminData.name || "", 
    email: adminData.email || "",
    contactNumber: adminData.contactNumber || "",
    profile: null 
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // FormData वापरून सर्व डेटा पाठवणे
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("contactNumber", formData.contactNumber);
    
    
    if (formData.profile) {
      data.append("profile", formData.profile);
    }

    try {
     
      await axiosInstance.put(`/user/update/${adminData.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Profile updated successfully!");
      onSuccess(); 
    } catch (err) { 
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

 return (
    <div className="card p-4 tasks-card" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4 fw-bold" style={{
        background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        ✏️ Edit Profile
      </h3>
      <form onSubmit={handleUpdate}>
        {/* Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            className="form-control bloom-filter-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email ID</label>
          <input
            className="form-control bloom-filter-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Contact Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Contact Number</label>
          <input
            className="form-control bloom-filter-input"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
        </div>

        {/* Profile Picture Field */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Change Profile Picture</label>
          <input
            type="file"
            className="form-control bloom-filter-input"
            onChange={(e) => setFormData({ ...formData, profile: e.target.files[0] })}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-bloom fw-bold px-4">
            Save Changes
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
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile