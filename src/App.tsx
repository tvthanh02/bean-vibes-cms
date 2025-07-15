import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import Users from './pages/admin/Users';
import ModeratorRequests from './pages/admin/ModeratorRequests';
import Reports from './pages/admin/Reports';
import Categories from './pages/admin/Categories';
import RestrictedWords from './pages/admin/RestrictedWords';
import PlacesPending from './pages/admin/PlacesPending';
import ModeratorLayout from './layouts/ModeratorLayout';
import ReviewsPending from './pages/moderator/ReviewsPending';
import ReportReviews from './pages/moderator/ReportReviews';
import ReportPlaces from './pages/moderator/ReportPlaces';
import ReportComments from './pages/moderator/ReportComments';
import PlacesPendingMod from './pages/moderator/PlacesPending';
import ReportsMod from './pages/moderator/Reports';
import ModeratorDashboard from './pages/moderator/Dashboard';
import CommentsAdmin from './pages/admin/Comments';
import CommentsMod from './pages/moderator/Comments';
import ReviewsAdmin from './pages/admin/Reviews';
import PlacesAdmin from './pages/admin/Places';
import ReviewsMod from './pages/moderator/Reviews';
import PlacesMod from './pages/moderator/Places';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route sẽ được thêm ở đây */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="moderator" element={<ModeratorRequests />} />
            <Route path="reports" element={<Reports />} />
            <Route path="categories" element={<Categories />} />
            <Route path="keywords" element={<RestrictedWords />} />
            <Route path="places" element={<PlacesAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="report-reviews" element={<ReportReviews />} />
            <Route path="report-comments" element={<ReportComments />} />
            <Route path="comments" element={<CommentsAdmin />} />
            {/* Các route quản trị khác sẽ thêm ở đây */}
          </Route>
        </Route>
        <Route path="/moderator" element={<ProtectedRoute role="moderator" />}>
          <Route element={<ModeratorLayout />}>
            <Route path="dashboard" element={<ModeratorDashboard />} />
            <Route path="report-places" element={<ReportPlaces />} />
            <Route path="places" element={<PlacesMod />} />
            <Route path="reviews" element={<ReviewsMod />} />
            <Route path="reports" element={<ReportsMod />} />
            <Route path="comments" element={<CommentsMod />} />
            {/* Các route chức năng moderator sẽ thêm ở đây */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
