import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../services/userservices";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      // ❌ No token → redirect
      if (!token) {
        navigate("/");
        return;
      }

      // ✅ Safe JWT decode
      let payload;
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      // ✅ API call
      const res = await getUserInfo(payload.id);
      console.log(res)

     if (res && res.name) { // रिस्पॉन्समध्ये 'name' आहे का ते तपासा
  setUser(res);       // थेट 'res' सेट करा
} else {
  localStorage.removeItem("token");
  navigate("/");
}
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
  <nav className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-white"}`} 
     style={{ borderBottom: theme === "dark" ? "2px solid #444" : "2px solid #dee2e6",borderTop: theme === "dark" ? "1px solid #444" : "2px solid #dee2e6",
      borderRight: theme === "dark" ? "1px solid #444" : "1px solid #dee2e6",
      borderLeft: theme === "dark" ? "1px solid #444" : "1px solid #dee2e6"
      }}>
  <div className="container">
    {/* Brand */}
    <span className="navbar-brand">Task Management</span>

    {/* Right side */}
    <div className="d-flex align-items-center">
      {user?.profile && (
        <img
          src={`http://localhost:5004/uploads/users/${user.profile}`}
          alt="Profile"
          width="40"
          height="40"
          className="rounded-circle me-2"
        />
      )}

     
      <span className="navbar-text me-3">
        Welcome, {user?.name || "User"}
      </span>

      <button 
        onClick={toggleTheme} 
        className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"} me-2`}
      >
        {theme === "light" ? "☀️ Light" : "🌙 Dark"} 
      </button>

      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  </div>
</nav>
  );
};

export default Navbar;
