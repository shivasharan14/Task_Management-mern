import { useEffect, useState } from "react";
import { getUserInfo } from "../services/userservices";
import EditProfile from "./EditProfile";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false); // हे एडिट मोडसाठी

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id || payload._id; 
        const data = await getUserInfo(userId);
        setAdminData(data); 
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading Profile...</div>;
  if (!adminData) return <div className="text-center mt-5">User data not found.</div>;

 return (
    <div className="container mt-2">
      {showEdit ? (
        <EditProfile
          adminData={adminData}
          onCancel={() => setShowEdit(false)}
          onSuccess={() => { setShowEdit(false); window.location.reload(); }}
        />
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card tasks-card text-center p-4">

              {/* Profile picture with gradient ring */}
              <div className="mb-3">
                {adminData.profile ? (
                  <div style={{
                    display: "inline-block",
                    padding: "4px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7b2ff7, #f107a3, #ff8a3d)",
                  }}>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/users/${adminData.profile}`}
                      alt="Profile"
                      className="rounded-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "3px solid #fff",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-circle text-white d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "108px",
                      height: "108px",
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #7b2ff7, #f107a3)",
                      border: "3px solid #fff",
                      boxShadow: "0 8px 20px rgba(241,7,163,0.3)",
                    }}
                  >
                    {adminData.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h3 className="card-title mb-1 text-capitalize fw-bold">{adminData.name}</h3>
              <span
                className="badge mx-auto mb-4 text-uppercase px-3 py-2 rounded-pill"
                style={{
                  letterSpacing: "1px",
                  background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
                  color: "#fff",
                  width: "fit-content",
                }}
              >
                {adminData.role}
              </span>

              <hr style={{ opacity: 0.1 }} />

              <div
                className="text-start mb-4 px-3 py-3 rounded-3"
                style={{ background: "linear-gradient(90deg, rgba(123,47,247,0.05), rgba(241,7,163,0.05))" }}
              >
                <p className="mb-2">
                  <strong>Email ID:</strong>{" "}
                  <span className="text-muted">{adminData.email}</span>
                </p>
                <p className="mb-0">
                  <strong>Account Status:</strong>{" "}
                  <span className="fw-bold" style={{ color: "#11998e" }}>● Active</span>
                </p>
              </div>

              <div className="d-grid gap-2 px-3">
                <button className="btn btn-bloom fw-bold" onClick={() => setShowEdit(true)}>
                  <i className="bi bi-pencil-square me-2"></i>Edit Profile
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    background: "transparent",
                    border: "1.5px solid rgba(0,0,0,0.15)",
                    borderRadius: "10px",
                    color: "#555",
                    padding: "8px 0",
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;