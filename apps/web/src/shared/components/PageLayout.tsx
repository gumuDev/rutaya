'use client';

import { Typography, Divider } from 'antd';
import { ReactNode } from 'react';

const { Title } = Typography;

interface Props {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ title, actions, children }: Props) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
        {actions}
      </div>
      <Divider style={{ marginTop: 12, marginBottom: 20 }} />
      {children}
    </>
  );
}
