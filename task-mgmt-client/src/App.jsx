import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateTask from "./components/UpdateTask";
import AllTasks from "./components/AllTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/task/update/:id"
          element={
            <ProtectedRoute>
              <UpdateTask />
            </ProtectedRoute>
          }
        />
       
     <Route 
      path="/all-tasks"  // 👈 हा तो 'रस्ता' (Path) आहे जो आपण ठरवला
      element={
      <ProtectedRoute>
        <AllTasks />
       </ProtectedRoute>
     } 
     />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;