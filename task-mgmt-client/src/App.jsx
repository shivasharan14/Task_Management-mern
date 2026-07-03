import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateTask from "./components/UpdateTask";
import AllTasks from "./components/AllTasks";
import { ThemeContext, ThemeProvider } from "./components/context/ThemeContext";

import "./index.css";

function App() {
  

  return (
    <ThemeProvider>
    <BrowserRouter>
    
    <ToastContainer position="top-right" autoClose={2000} />
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
    </ThemeProvider>
  );
}

export default App;