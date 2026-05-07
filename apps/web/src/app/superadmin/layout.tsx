'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Typography, Drawer, Grid } from 'antd';
import { BankOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { isAuthenticated, clearSession, getRole } from '@/features/auth/hooks/useAuth';
import { colors } from '@/shared/theme/colors';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== 'superadmin') router.replace('/login');
    else setReady(true);
  }, [router]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (!ready) return null;

  const menuItems = [
    { key: '/superadmin/companies', icon: <BankOutlined />, label: 'Empresas' },
  ];

  const logo = (
    <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.border}` }}>
      <Text strong style={{ fontSize: 16 }}>
        <span style={{ color: colors.primary }}>Ruta</span>
        <span style={{ color: colors.secondary }}>Ya</span>
        <span style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 6 }}>superadmin</span>
      </Text>
    </div>
  );

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {logo}
      <Menu
        mode="inline"
        selectedKeys={[pathname.startsWith('/superadmin/companies') ? '/superadmin/companies' : '']}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ border: 'none', flex: 1, marginTop: 8 }}
      />
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${colors.border}` }}>
        <Button type="text" danger icon={<LogoutOutlined />} block
          onClick={() => { clearSession(); router.push('/login'); }}>
          Cerrar sesión
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
            <span style={{ color: colors.primary }}>Ruta</span><span style={{ color: colors.secondary }}>Ya</span>
          </Text>
        </Header>
        <Drawer placement="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={240} styles={{ body: { padding: 0 }, header: { display: 'none' } }}>
          {sidebarContent}
        </Drawer>
        <Content style={{ margin: 16 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, minHeight: 'calc(100vh - 64px - 32px)' }}>
            {children}
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.bg }}>
      <Sider style={{ background: '#fff', borderRight: `1px solid ${colors.border}` }}>
        {sidebarContent}
      </Sider>
      <Layout style={{ background: colors.bg }}>
        <Content style={{ margin: 24, background: '#fff', borderRadius: 12, padding: 24, minHeight: 'calc(100vh - 48px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
