import { Navigate } from "react-router-dom";

function ProtectedRouter({ children }) {
  const userToken = localStorage.getItem("userToken");
  const studentDet =JSON.parse( localStorage.getItem("studentDet"));
  const role = localStorage.getItem("role");

  // Not logged in
  if (!userToken || !role) {
    return <Navigate to="/login" replace />;
  }

  // Admins can access everything
  if (role === "admin") {
    return children;
  }

  // Logged in but student not registered
  if (role === "user" && !studentDet) {
    return <Navigate to="/student-register" replace />;
  }

  // Logged in and student registered
  if (role === "user" && studentDet) {
    return children;
  }

  // Fallback
  return <Navigate to="/login" replace />;
}

export default ProtectedRouter;
