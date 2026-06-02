'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Typography, Drawer, Grid } from 'antd';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, CalendarOutlined,
  CarOutlined, EnvironmentOutlined, UnorderedListOutlined, LogoutOutlined,
  CreditCardOutlined, TeamOutlined, ShopOutlined, DashboardOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { isAuthenticated, clearSession, getRole, getSuperToken, exitImpersonation } from '@/features/auth/hooks/useAuth';
import { colors } from '@/shared/theme/colors';

const { Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const SIDEBAR_WIDTH = 240;

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
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Panel de Control', roles: ['admin', 'operator'], exact: true },
    { key: '/dashboard/pos', icon: <ShopOutlined />, label: 'Nueva venta', roles: ['admin', 'operator'] },
    { key: '/dashboard/reservations', icon: <UnorderedListOutlined />, label: t('reservations'), roles: ['admin', 'operator'] },
    { key: '/dashboard/vehicles', icon: <CarOutlined />, label: t('vehicles'), roles: ['admin'] },
    { key: '/dashboard/routes', icon: <EnvironmentOutlined />, label: t('routes'), roles: ['admin'] },
    { key: '/dashboard/schedules', icon: <CalendarOutlined />, label: t('schedules'), roles: ['admin'] },
    { key: '/dashboard/payment-config', icon: <CreditCardOutlined />, label: t('paymentConfig'), roles: ['admin'] },
    { key: '/dashboard/team', icon: <TeamOutlined />, label: 'Equipo', roles: ['admin'] },
  ];
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const selectedKey = menuItems.find(item =>
    item.exact ? pathname === item.key : pathname.startsWith(item.key) && item.key !== '/dashboard'
  )?.key ?? (pathname === '/dashboard' ? '/dashboard' : '');

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: colors.primary, letterSpacing: -0.5, marginBottom: 2 }}>
          RutaYa
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 500 }}>
          Gestión de Flota
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ border: 'none' }}
          theme="light"
        />
      </div>

      {/* Bottom actions */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${colors.border}` }}>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          block
          onClick={() => { clearSession(); router.push('/login'); }}
          style={{ textAlign: 'left', justifyContent: 'flex-start' }}
        >
          {t('logout')}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Layout style={{ minHeight: '100vh', background: colors.bg }}>
        {/* Mobile header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: '#fff',
          borderBottom: `1px solid ${colors.border}`,
          padding: '0 16px',
          height: 60,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <Button
            type="text"
            icon={<MenuUnfoldOutlined style={{ fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
            style={{ padding: 4 }}
          />
          <span style={{ fontSize: 18, fontWeight: 900, color: colors.primary, letterSpacing: -0.5 }}>
            RutaYa
          </span>
        </div>

        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={SIDEBAR_WIDTH}
          styles={{ body: { padding: 0 }, header: { display: 'none' } }}
        >
          {sidebarContent}
        </Drawer>

        <Content style={{ padding: 16 }}>
          {isImpersonating && (
            <div style={{
              background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8,
              padding: '8px 16px', marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Text style={{ fontSize: 13 }}>👁️ Viendo como <Text strong>superadmin</Text></Text>
              <Button size="small" onClick={handleExitImpersonation}>Volver al panel</Button>
            </div>
          )}
          {children}
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.bgSection }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={SIDEBAR_WIDTH}
        style={{
          background: '#fff',
          borderRight: `1px solid ${colors.border}`,
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden',
        }}
      >
        {sidebarContent}
      </Sider>

      <Layout style={{ background: colors.bgSection }}>
        {/* Top bar */}
        <div style={{
          background: '#fff',
          borderBottom: `1px solid ${colors.border}`,
          padding: '0 24px',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18 }}
          />
          {isImpersonating && (
            <div style={{
              background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8,
              padding: '4px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Text style={{ fontSize: 13 }}>👁️ Viendo como <Text strong>superadmin</Text></Text>
              <Button size="small" onClick={handleExitImpersonation}>Volver</Button>
            </div>
          )}
        </div>

        <Content style={{ padding: 24, minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
