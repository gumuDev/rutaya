'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Typography, Drawer, Grid } from 'antd';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, CalendarOutlined,
  CarOutlined, EnvironmentOutlined, UnorderedListOutlined, LogoutOutlined,
  CreditCardOutlined, TeamOutlined, ShopOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { isAuthenticated, clearSession, getRole, getSuperToken, exitImpersonation } from '@/features/auth/hooks/useAuth';
import { colors } from '@/shared/theme/colors';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<string>('operator');
  const [isImpersonating, setIsImpersonating] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login');
    else { setRole(getRole()); setIsImpersonating(!!getSuperToken()); setReady(true); }
  }, [router]);

  function handleExitImpersonation() {
    exitImpersonation();
    router.push('/superadmin/companies');
  }

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (!ready) return null;

  const allMenuItems = [
    { key: '/dashboard/pos', icon: <ShopOutlined />, label: 'Nueva venta', roles: ['admin', 'operator'] },
    { key: '/dashboard/reservations', icon: <UnorderedListOutlined />, label: t('reservations'), roles: ['admin', 'operator'] },
    { key: '/dashboard/vehicles', icon: <CarOutlined />, label: t('vehicles'), roles: ['admin'] },
    { key: '/dashboard/routes', icon: <EnvironmentOutlined />, label: t('routes'), roles: ['admin'] },
    { key: '/dashboard/schedules', icon: <CalendarOutlined />, label: t('schedules'), roles: ['admin'] },
    { key: '/dashboard/payment-config', icon: <CreditCardOutlined />, label: t('paymentConfig'), roles: ['admin'] },
    { key: '/dashboard/team', icon: <TeamOutlined />, label: 'Equipo', roles: ['admin'] },
  ];
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const selectedKey = menuItems.find(item => pathname.startsWith(item.key))?.key ?? '';

  const logo = (
    <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.border}` }}>
      <Text strong style={{ fontSize: 18 }}>
        <span style={{ color: colors.primary }}>Ruta</span>
        <span style={{ color: colors.secondary }}>Ya</span>
      </Text>
    </div>
  );

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {logo}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ border: 'none', flex: 1, marginTop: 8 }}
      />
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${colors.border}` }}>
        <Button type="text" danger icon={<LogoutOutlined />} block
          onClick={() => { clearSession(); router.push('/login'); }}>
          {t('logout')}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Layout style={{ minHeight: '100vh', background: colors.bg }}>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
          <Button type="text" icon={<MenuUnfoldOutlined />} onClick={() => setDrawerOpen(true)} style={{ marginRight: 12 }} />
          <Text strong style={{ fontSize: 16 }}>
            <span style={{ color: colors.primary }}>Ruta</span>
            <span style={{ color: colors.secondary }}>Ya</span>
          </Text>
        </Header>
        <Drawer placement="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={240} styles={{ body: { padding: 0 }, header: { display: 'none' } }}>
          {sidebarContent}
        </Drawer>
        <Content style={{ margin: 16 }}>
          {isImpersonating && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '8px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13 }}>👁️ Estás viendo el dashboard como <Text strong>superadmin</Text></Text>
              <Button size="small" onClick={handleExitImpersonation}>Volver al panel</Button>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, minHeight: 'calc(100vh - 64px - 32px)' }}>
            {children}
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.bg }}>
      <Sider collapsible collapsed={collapsed} trigger={null} style={{ background: '#fff', borderRight: `1px solid ${colors.border}` }}>
        {sidebarContent}
      </Sider>
      <Layout style={{ background: colors.bg }}>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
        </Header>
        <Content style={{ margin: 24, minHeight: 'calc(100vh - 64px - 48px)' }}>
          {isImpersonating && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '8px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13 }}>👁️ Estás viendo el dashboard como <Text strong>superadmin</Text></Text>
              <Button size="small" onClick={handleExitImpersonation}>Volver al panel</Button>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minHeight: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
