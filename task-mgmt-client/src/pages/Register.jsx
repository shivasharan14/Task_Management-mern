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

  // REMOVE IMAGE
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Register</h2>

            <form onSubmit={handleSubmit}>
              {/* IMAGE PREVIEW WITH CENTER DELETE ICON */}
              <div className="text-center mb-3">
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={preview || defaultAvatar}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ccc",
                    }}
                  />

                  {/* DELETE ICON (CENTER) */}
                  {preview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: "absolute",
                        bottom: "50%",
                        left: "100%",
                        transform: "translate(-50%, -50%)",
                        background: "rgba(255,0,0,0.85)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                       
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* FILE INPUT */}
              <div className="mb-3">
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

              <button className="btn btn-success w-100">
                Register
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;