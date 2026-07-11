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

      if (!token) {
        navigate("/");
        return;
      }

      let payload;
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const res = await getUserInfo(payload.id);
      console.log(res);

      if (res && res.name) {
        setUser(res);
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
   <nav
      className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark" : "navbar-light"}`}
      style={{
        background: theme === "dark"
          ? "linear-gradient(90deg, #1a0b2e, #2d1250)"
          : "linear-gradient(90deg, #fdf4ff, #fff0f8, #fff7ed)",
        borderBottom: "3px solid transparent",
        borderImage: "linear-gradient(90deg, #7b2ff7, #f107a3, #ff8a3d) 1",
        boxShadow: "0 4px 20px rgba(123,47,247,0.10)",
        padding: "0.9rem 0",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="container">
        {/* Brand */}
        <span
          className="navbar-brand d-flex align-items-center"
          style={{ gap: "6px" }}
        >
          <span style={{ fontSize: "1.5rem" }}>🌸</span>
          <span
            style={{
              background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              fontSize: "1.3rem",
            }}
          >
            TaskBloom
          </span>
        </span>

        {/* Right side */}
        <div className="d-flex align-items-center">
          {user?.profile && (
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/users/${user.profile}`}
              alt="Profile"
              width="38"
              height="38"
              className="rounded-circle me-2"
              style={{
                border: "2px solid #f107a3",
                objectFit: "cover",
              }}
            />
          )}

          <span
            className="navbar-text me-3 d-none d-sm-inline"
            style={{ fontWeight: 500 }}
          >
            Welcome, <strong>{user?.name || "User"}</strong>
          </span>

          <button
            onClick={toggleTheme}
            className="btn btn-sm me-2"
            style={{
              borderRadius: "20px",
              border: theme === "dark" ? "1.5px solid #555" : "1.5px solid #ddd",
              background: "transparent",
              color: theme === "dark" ? "#fff" : "#333",
              fontWeight: 500,
              padding: "6px 14px",
            }}
          >
            {theme === "light" ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            className="btn btn-sm"
            style={{
              background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              borderRadius: "20px",
              padding: "6px 16px",
              boxShadow: "0 4px 12px rgba(241,7,163,0.3)",
            }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;