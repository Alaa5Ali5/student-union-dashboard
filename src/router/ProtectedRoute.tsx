import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  // 1. التحقق من وجود التوكن
  const token = localStorage.getItem('authToken');

  // 2. إذا لم يكن التوكن موجودًا، قم بإعادة التوجيه إلى صفحة تسجيل الدخول
  if (!token) {
    // نستخدم مكون <Navigate> لإعادة التوجيه
    return <Navigate to="/login" replace />;
  }

  // 3. إذا كان التوكن موجودًا، اعرض المحتوى المحمي (الذي هو في حالتنا لوحة التحكم)
  // <Outlet /> هنا سيمثل `DashboardLayout` وكل صفحاته الفرعية
  return <Outlet />;
};