import { useEffect, useState } from "react";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log(payload)
        setAdminData({
          name: payload.name || "System Admin",
          email: payload.email || "admin@task.com",
          role: payload.role || "admin"
        });
      } catch (error) {
        console.log("Error parsing token data", error);
      }
    }
  }, []);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          
          <div className="card shadow text-center p-4">
            <div className="mb-3">
             
              <div 
                className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center shadow-sm" 
                style={{ width: "90px", height: "90px", fontSize: "2.5rem", border: "3px solid #ffc107" }}
              >
                {adminData.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <h3 className="card-title mb-1 text-capitalize">{adminData.name}</h3>
            <span className="badge bg-danger mx-auto mb-4 text-uppercase px-3 py-2" style={{ width: "fit-content", letterSpacing: "1px" }}>
              {adminData.role}
            </span>
            
            <hr />
            
            <div className="text-start mb-4 px-3">
              <p className="mb-2"><strong>Email ID:</strong> <span className="text-muted">{adminData.email}</span></p>
              <p className="mb-2"><strong>Account Status:</strong> <span className="text-success fw-bold">Active</span></p>
            </div>

            <div className="d-grid gap-2 px-3">
              <button className="btn btn-warning fw-bold" onClick={() => alert("Edit Profile Feature Coming Soon!")}>
                Edit Profile
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => alert("Change Password Feature Coming Soon!")}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;