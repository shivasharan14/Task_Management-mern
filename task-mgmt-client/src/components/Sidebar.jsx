import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ setPage }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

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
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh",
      }}
    >
      <div className="p-3 border-bottom">
        <h4 className="text-center m-0">Task Management</h4>
      </div>

      <ul className="nav flex-column p-3">
        {menus.map((menu) => (
          <li key={menu.page} className="nav-item mb-2">
            <button
              className="btn btn-dark text-start w-100"
              onClick={() => setPage(menu.page)}
            >
              {menu.icon} {menu.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto p-3 border-top">
        <small className="text-info">
          Role : {role}
        </small>

        <button
          className="btn btn-danger w-100 mt-3"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;