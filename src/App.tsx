import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import UsersListPage from "./pages/Users/UsersListPage";
import UserDetailPage from "./pages/Users/UserDetailPage";
import UserFormPage from "./pages/Users/UserFormPage";
import RolesListPage from "./pages/Roles/RolesListPage";
import RoleFormPage from "./pages/Roles/RoleFormPage";
import PermissionsPage from "./pages/Permissions/PermissionsPage";
import AssignmentsPage from "./pages/Assignments/AssignmentsPage";
import UnauthorizedPage from "./pages/OtherPage/UnauthorizedPage";
import RolesPermissions from "./pages/Roles/RolesPermissions";
import VendorsListPage from "./pages/Vendors/VendorsListPage";
import VendorDetailPage from "./pages/Vendors/VendorDetailPage";
import VendorFormPage from "./pages/Vendors/VendorFormPage";
import MyVendorApiKeyPage from "./pages/Vendors/MyVendorApiKeyPage";
import StatesListPage from "./pages/States/StatesListPage";
import StateFormPage from "./pages/States/StateFormPage";
import CitiesListPage from "./pages/Cities/CitiesListPage";
import CityFormPage from "./pages/Cities/CityFormPage";
import WalletPage from "./pages/Vendors/WalletPage";
import TransactionHistoryPage from "./pages/Transactions/TransactionHistoryPage";
import ManageBookingsPage from "./pages/Bookings/ManageBookingsPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<GuestRoute />}>
            <Route index element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Protected Dashboard Layout */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Home />} />

              {/* Others Page */}
              <Route path="profile" element={<UserProfiles />} />

              {/* Access Management (RBAC) */}
              <Route path="users" element={<UsersListPage />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="users/:id/edit" element={<UserFormPage />} />
              <Route path="roles" element={<RolesListPage />} />
              <Route path="roles/new" element={<RoleFormPage />} />
              <Route path="roles/:id/edit" element={<RoleFormPage />} />
              <Route path="permissions" element={<PermissionsPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="roles-permissions" element={<RolesPermissions />} />

              {/* Vendors */}
              <Route path="vendors" element={<VendorsListPage />} />
              <Route path="vendors/new" element={<VendorFormPage />} />
              <Route path="vendors/:id" element={<VendorDetailPage />} />
              <Route path="vendors/api-key" element={<MyVendorApiKeyPage />} />
              <Route path="vendors/wallet" element={<WalletPage />} />

              {/* Transaction History (admin / super_admin) */}
              <Route path="transactions" element={<TransactionHistoryPage />} />

              {/* Manage Bookings (vendor only) */}
              <Route path="bookings" element={<ManageBookingsPage />} />

              {/* Master Data */}
              <Route path="states" element={<StatesListPage />} />
              <Route path="states/new" element={<StateFormPage />} />
              <Route path="states/:id/edit" element={<StateFormPage />} />
              <Route path="cities" element={<CitiesListPage />} />
              <Route path="cities/new" element={<CityFormPage />} />
              <Route path="cities/:id/edit" element={<CityFormPage />} />

            </Route>
          </Route>

          <Route path="unauthorized" element={<UnauthorizedPage />} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
