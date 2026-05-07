'use client';

import { useEffect, useState } from 'react';
import { Button, Typography, Spin, Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined, LoginOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import dayjs from '@/shared/lib/dayjs';
import { getCompany, impersonateCompany } from '@/features/superadmin/services/superadmin.service';
import { CompanySummary } from '@/features/superadmin/types/superadmin.types';
import { colors } from '@/shared/theme/colors';

const { Title, Text } = Typography;

export default function SuperadminCompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<CompanySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    getCompany(id).then(setCompany).finally(() => setLoading(false));
  }, [id]);

  async function handleImpersonate() {
    if (!company) return;
    setImpersonating(true);
    try {
      await impersonateCompany(company.id);
      router.push('/dashboard/reservations');
    } finally {
      setImpersonating(false);
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spin size="large" /></div>;
  if (!company) return <Text>Empresa no encontrada.</Text>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => router.push('/superadmin/companies')}>
          Volver
        </Button>
        <Title level={4} style={{ margin: 0, color: colors.secondary, flex: 1 }}>{company.name}</Title>
        <Button
          type="primary"
          icon={<LoginOutlined />}
          loading={impersonating}
          onClick={handleImpersonate}
          style={{ background: colors.primary, borderColor: colors.primary }}
        >
          Acceder al dashboard
        </Button>
      </div>

      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
        <Descriptions.Item label="Nombre">{company.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{company.email}</Descriptions.Item>
        <Descriptions.Item label="Teléfono">{company.phone}</Descriptions.Item>
        <Descriptions.Item label="Ciudad">{company.city}</Descriptions.Item>
        <Descriptions.Item label="NIT / RUC">{company.taxId ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Rol">
          <Tag color={company.role === 'admin' ? 'blue' : 'green'}>{company.role}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Registrada">{dayjs(company.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}
