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
    <div className="container mt-4">
      {/* इथून लॉजिक सुरू: जर showEdit true असेल तर EditProfile दिसेल, नाहीतर मूळ प्रोफाइल */}
      {showEdit ? (
        <EditProfile 
          adminData={adminData} 
          onCancel={() => setShowEdit(false)} 
          onSuccess={() => { setShowEdit(false); window.location.reload(); }} 
        />
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm text-center p-4" style={{ borderRadius: "15px" }}>
              <div className="mb-3">
                {adminData.profile ? (
                  <img
                    src={`http://localhost:5004/uploads/users/${adminData.profile}`}
                    alt="Profile"
                    className="rounded-circle shadow-sm"
                    style={{ width: "100px", height: "100px", objectFit: "cover", border: "4px solid #ffc107" }}
                  />
                ) : (
                  <div className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center shadow-sm" 
                       style={{ width: "100px", height: "100px", fontSize: "2.5rem", border: "4px solid #ffc107" }}>
                    {adminData.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h3 className="card-title mb-1 text-capitalize fw-bold">{adminData.name}</h3>
              <span className="badge bg-danger mx-auto mb-4 text-uppercase px-3 py-2" style={{ letterSpacing: "1px" }}>
                {adminData.role}
              </span>
              
              <hr />
              
              <div className="text-start mb-4 px-3">
                <p className="mb-2"><strong>Email ID:</strong> <span className="text-muted">{adminData.email}</span></p>
                <p className="mb-2"><strong>Account Status:</strong> <span className="text-success fw-bold">Active</span></p>
              </div>

              <div className="d-grid gap-2 px-3">
                
                <button className="btn btn-warning fw-bold" onClick={() => setShowEdit(true)}>
                  Edit Profile
                </button>
                <button className="btn btn-outline-secondary btn-sm">
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