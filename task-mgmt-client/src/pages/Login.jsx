import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userservices";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await loginUser(formData);

      console.log("LOGIN RESPONSE FROM BACKEND:", res);

      const data = res.data || res;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);

        if (data.name) {
          localStorage.setItem("userName", data.name);
        }

        toast.success(data.msg || "Login Successful 🎉");
        navigate("/dashboard");
      } else {
        toast.error(data.msg || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div className="brand-header">
          <div className="brand-logo">🌸</div>
          <div className="brand-name">TaskBloom</div>
          <div className="brand-tagline">Plan less. Grow more.</div>
        </div>

        <div className="card auth-card">

          <h2 className="text-center mb-4">Welcome back</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
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

            <div className="mb-4">
              <label>Password</label>
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

            <button className="btn btn-bloom w-100">
              Login
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;