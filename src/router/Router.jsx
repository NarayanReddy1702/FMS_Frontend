import { createBrowserRouter } from "react-router-dom";
import CommonPage from "../components/CommonPage";
import Login from "../UI/Login";
import SignUp from "../UI/SignUp";
import StudentRegister from "../UI/StudentRegister";
import App from "../App";
import ProtectedRouter from "../middleware/ProtectedRouter";
import ProfilePage from "../components/Profile";
import UpdateUser from "../pages/User/UpdateUser";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserAdmin from "../pages/Admin/UserAdmin";
import HomeAdmin from "../pages/Admin/HomeAdmin";
import StudentAdmin from "../pages/Admin/StudentAdmin";
import AdminProfile from "../pages/Admin/AdminProfile";
import AdminEdit from "../pages/Admin/AdminEdit";
import UpdateAdmin from "../pages/Admin/UpdateAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CommonPage />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRouter>
            <App />
          </ProtectedRouter>
        ),
      },
      {
        path: "/profile",
        element: <ProtectedRouter>
            <ProfilePage />
        </ProtectedRouter>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "/student-register",
        element: <StudentRegister />,
      },
      {
        path:"/updateUser/:id",
        element:<UpdateUser/>
      }
    ],
  },

 {
    path: "/admin",
    element: (
      <ProtectedRouter>
        <AdminDashboard />
      </ProtectedRouter>
    ),
    children: [
      { path: "/admin", element: <HomeAdmin /> },
      { path: "/admin/users", element: <UserAdmin /> },
      { path: "/admin/students", element: <StudentAdmin /> },
      { path: "/admin/profile", element: <AdminProfile /> },
     
    ],
  },
   { path: "/admin/userEdit/:id", element: <AdminEdit /> },
   {path:"/admin/adminEdit/:id",element:<UpdateAdmin/>}
]);

export default router;
