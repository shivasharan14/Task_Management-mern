import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/userservices";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    profile: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];

      setFormData({
        ...formData,
        profile: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      profile: null,
    });

    setPreview(null);

    document.getElementById("profileInput").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("contactNumber", formData.contactNumber);

    if (formData.profile) {
      data.append("profile", formData.profile);
    }

    try {
      const res = await registerUser(data);

      if (res.success) {
        toast.success(res.msg);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div className="brand-header">
          <div className="brand-logo">🌸</div>
          <div className="brand-name">TaskBloom</div>
          <div className="brand-tagline">Create your account and start growing</div>
        </div>

        <div className="card auth-card" style={{ maxWidth: "460px" }}>
          <h2 className="text-center mb-4">Create account</h2>

          <form onSubmit={handleSubmit}>
            {/* IMAGE PREVIEW WITH CENTER DELETE ICON */}
            <div className="text-center mb-4">
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={preview || defaultAvatar}
                  alt="Profile Preview"
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #f107a3",
                    boxShadow: "0 6px 16px rgba(241,7,163,0.25)",
                  }}
                />

                {preview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      right: "-6px",
                      background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
                      color: "white",
                      border: "2px solid #fff",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                name="contactNumber"
                placeholder="10-digit mobile number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Profile Image</label>
              <input
                id="profileInput"
                type="file"
                className="form-control"
                name="profile"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-bloom w-100">
              Register
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;