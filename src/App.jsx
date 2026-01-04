import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Layouts */
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";

/* Auth */
import Auth from "./pages/auth/Auth";

/* User Pages */
import HomePage from "./pages/user/home/HomePage";
import Explore from "./pages/user/home/Explore";
import ProfilePage from "./pages/user/profile/ProfilePage";
import Contact from "./pages/user/contact/Contact";
import About from "./pages/user/about/About";
import Payment from "./pages/user/home/Payment";

/* Admin Pages */
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import UsersPage from "./pages/admin/users/UsersPage";
import RentPage from "./pages/admin/rent/RentPage";
import RoomPage from "./pages/admin/rooms/RoomPage";
import Addroom from "./pages/admin/rooms/components/Addroom";
import Notifications from "./pages/admin/notification/Notifications";
import Settings from "./pages/admin/settings/Settings";

/* Protected Route */
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

/* ChatBot */
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <Router>
      {/* ✅ ChatBot should be here */}
      <ChatBot />

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Auth register={false} />} />
        <Route path="/signup" element={<Auth register={true} />} />

        {/* USER PROFILE */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<Payment />} />

        {/* USER ROUTES */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<Explore />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ADMIN ROUTES (PROTECTED) */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="rent" element={<RentPage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="addrooms" element={<Addroom />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
