import { Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/Footer";
import HeaderNav from "./components/HeaderNav";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
    <HeaderNav/>
    <Routes>
      <Route path="/task" element={
          <TaskPage />
      } />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/task" replace />} />
    </Routes>
    <Footer/>
    </>
    
  );
}

export default App;
