import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { CollegesPage } from '../pages/CollegesPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // مسار محمي جديد
    path: '/',
    element: <ProtectedRoute />, // 1. تحقق من تسجيل الدخول أولاً
    children: [
      {
        // إذا نجح التحقق، اعرض DashboardLayout
        path: '/', 
        element: <DashboardLayout />,
        // وهذه الصفحات ستظهر داخل <Outlet /> الخاص بـ DashboardLayout
        children: [
          {
            index: true, // الصفحة الافتراضية عند الدخول على '/'
            element: <ApplicationsPage />,
          },
          {
            path: 'colleges',
            element: <CollegesPage />,
          },
        ],
      },
    ],
  },
]);