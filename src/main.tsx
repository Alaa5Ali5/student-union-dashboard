import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';

// استيراد ملفات CSS الأساسية لـ Mantine
import '@mantine/core/styles.css';

// إنشاء نسخة (instance) من QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 
      ترتيب الـ Providers مهم.
      QueryClientProvider يجب أن يغلف أي جزء من التطبيق يستخدم React Query (مثل صفحة تسجيل الدخول).
    */}
    <QueryClientProvider client={queryClient}>
      {/* 
        MantineProvider يوفر الـ theme لجميع مكونات Mantine.
      */}
      <MantineProvider defaultColorScheme="dark">
        {/* 
          RouterProvider هو الذي يقوم بعرض الصفحات بناءً على المسار الحالي في الـ URL.
        */}
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);