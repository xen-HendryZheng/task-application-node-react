import { Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/Footer";
import HeaderNav from "./components/HeaderNav";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
import { AlertProvider } from "./components/alert/Alert";

function App() {
  return (
    <>
     <AlertProvider>
      <UserProvider>
        <Routes>
          <Route path="/task" element={
              <ProtectedRoute>
                <>
                <HeaderNav />
                <TaskPage />
                </>
              </ProtectedRoute>
          } />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/task" replace />} />
        </Routes>
        <Footer />
      </UserProvider>
      </AlertProvider>
    </>

  );
}

export default App;
