import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ setPage, theme, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMenuClick = (page) => {
    setActivePage(page);
    setPage(page);
  };

  const userMenus = [
    { title: "Dashboard", page: "dashboard", icon: "📊" },
    { title: "All Tasks", page: "tasks", icon: "📝" },
    { title: "Profile", page: "profile", icon: "👤" },
  ];

  const adminMenus = [
    { title: "Dashboard", page: "dashboard", icon: "📊" },
    { title: "All Tasks", page: "tasks", icon: "📝" },
    { title: "Create Task", page: "create", icon: "➕" },
    { title: "Profile", page: "profile", icon: "👤" },
  ];

  const menus = role === "admin" ? adminMenus : userMenus;

  return (
    <div
      className={`d-flex flex-column bloom-sidebar ${isOpen ? "sidebar-open" : ""}`}
      style={{
        minHeight: "100vh",
        background: theme === "dark"
          ? "#151515"
          : "linear-gradient(180deg, #1a0b2e 0%, #3b0764 45%, #7b2ff7 100%)",
        boxShadow: "2px 0 16px rgba(0,0,0,0.15)",
        zIndex: 1050,
        transition: "all 0.3s ease",
      }}
    >
      <div className="p-4 text-center position-relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <button
          className="sidebar-close-btn position-absolute"
          onClick={onClose}
          style={{
            top: "12px", right: "12px", border: "none", background: "transparent",
            color: "#fff", fontSize: "1.3rem",
          }}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <h5 className="m-0 mt-2" style={{ color: "#fff", fontWeight: 800, letterSpacing: "-0.3px" }}>
          TaskBloom
        </h5>
      </div>
      <ul className="nav flex-column p-3" style={{ gap: "6px" }}>
        {menus.map((menu) => {
          const isActive = activePage === menu.page;
          return (
            <li key={menu.page} className="nav-item mb-1">
              <button
                className="btn text-start w-100 d-flex align-items-center"
                onClick={() => handleMenuClick(menu.page)}
                style={{
                  borderRadius: "10px",
                  padding: "10px 14px",
                  gap: "10px",
                  fontWeight: 600,
                  border: "none",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                  background: isActive
                    ? "linear-gradient(90deg, #f107a3, #ff8a3d)"
                    : "transparent",
                  boxShadow: isActive ? "0 6px 16px rgba(241,7,163,0.35)" : "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{menu.icon}</span>
                {menu.title}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div
          className="mb-3 px-2 py-2 text-center"
          style={{
            borderRadius: "10px",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          Role: {role || "user"}
        </div>

        <button
          className="btn w-100"
          onClick={handleLogout}
          style={{
            borderRadius: "10px",
            border: "1.5px solid rgba(255,255,255,0.25)",
            background: "transparent",
            color: "#fff",
            fontWeight: 600,
            padding: "9px 0",
          }}
        >
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;