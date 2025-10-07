import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink as RouterNavLink, Outlet } from 'react-router-dom';
// يمكنك استيراد أيقونات من مكتبة مثل react-icons إذا أردت
// import { IconGauge, IconUsers } from '@tabler/icons-react';

export function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={4}>لوحة تحكم اتحاد الطلبة</Title>
          {/* زر تسجيل الخروج يمكن وضعه هنا */}
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
            تسجيل الخروج
          </button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Title order={5} mb="lg">القائمة</Title>
        {/* 
          استخدام NavLink من Mantine للتصميم
          واستخدام RouterNavLink من react-router للتنقل
        */}
        <NavLink
          label="طلبات الانضمام"
          component={RouterNavLink}
          to="/"
          // leftSection={<IconGauge size="1rem" stroke={1.5} />}
        />
        <NavLink
          label="إدارة الكليات"
          component={RouterNavLink}
          to="/colleges"
          // leftSection={<IconUsers size="1rem" stroke={1.5} />}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* 
          <Outlet /> هو المكان الذي سيتم فيه عرض محتوى الصفحة الحالية
          (مثل صفحة الطلبات أو صفحة الكليات)
        */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}