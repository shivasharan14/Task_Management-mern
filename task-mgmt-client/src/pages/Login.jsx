import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userservices";

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

      // 💡 बदल १: जर तुमची सर्व्हिस थेट 'res.data' देत असेल किंवा 'res' देत असेल, दोघांना सुरक्षित मॅनेज करू:
      const data = res.data || res;

      if (data.success) {
        // १. टोकन सेव्ह केलं
        localStorage.setItem("token", data.token);

        // २. 💡 मुख्य बदल: आता बॅकएंडवरून येणारा अचूक रोल आणि युझर आयडी इथे सेव्ह होईल!
        localStorage.setItem("role", data.role); 
        localStorage.setItem("userId", data.userId); 
        
        // (ऑप्शनल) जर युझरचे नाव पण स्टोअर करायचे असेल तर:
        if (data.name) {
          localStorage.setItem("userName", data.name);
        }

        alert(data.msg || "Login Successful 🎉");
        navigate("/dashboard");
      } else {
        alert(data.msg || "Login Failed");
      }

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4">

            <h2 className="text-center mb-4">Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email</label>
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
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Register</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;