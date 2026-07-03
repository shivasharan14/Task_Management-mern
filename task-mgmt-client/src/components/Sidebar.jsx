import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ setPage ,theme }) => {
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
  const sidebarClass = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";

  // तुझा कोड जसा आहे तसाच राहू दे, फक्त हा 'return' चा भाग असा कर:

  return (
   <div
  className={`${sidebarClass} d-flex flex-column`}
  style={{
    width: "260px",
    minHeight: "100vh",
    // राखाडी टोन आणि शेडोचा वापर करून गहराई (Depth) निर्माण केली आहे
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
    borderRight: theme === "dark" ? "1px solid #333" : "1px solid #e0e0e0",
    boxShadow: "2px 0 10px rgba(0,0,0,0.08)", // थोडी जास्त शेडो
    zIndex: 1000,
    transition: "all 0.3s ease" // स्मूथ ट्रान्झिशन
  }}
>
      <div className="p-3 border-bottom">
        <h4 className="text-center m-0">Task Management</h4>
      </div>

      <ul className="nav flex-column p-3">
  {menus.map((menu) => (
    <li key={menu.page} className="nav-item mb-2">
      <button
        // इथे btn-outline-... वापरल्यामुळे बॉर्डर आपोआप येईल
        className={`btn ${
          theme === "dark" 
            ? "btn-outline-secondary" 
            : "btn-outline-dark"
        } text-start w-100`}
        onClick={() => setPage(menu.page)}
        style={{ borderRadius: "6px" }} // थोडी गोलाकार बॉर्डर दिली तर अधिक छान दिसेल
      >
        {menu.icon} {menu.title}
      </button>
    </li>
  ))}
</ul>

      <div className="mt-auto p-3 border-top">
        <small className={theme === "dark" ? "text-info" : "text-primary"}>
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