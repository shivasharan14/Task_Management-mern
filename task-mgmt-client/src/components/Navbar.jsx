import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../services/userservices";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [navigate]);

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

      if (res?.success) {
        setUser(res.loggedUser);
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        {/* Brand */}
        <span className="navbar-brand">
          Task Management
        </span>

        {/* Right side */}
        <div className="d-flex align-items-center">

          <span className="text-white me-3">
            Welcome, {user?.name || "User"}
          </span>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;