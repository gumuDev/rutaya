'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography, Input, Spin, Grid } from 'antd';
import { EyeOutlined, LoginOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from '@/shared/lib/dayjs';
import { listCompanies, impersonateCompany } from '@/features/superadmin/services/superadmin.service';
import { CompanySummary } from '@/features/superadmin/types/superadmin.types';
import { colors } from '@/shared/theme/colors';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function SuperadminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [filtered, setFiltered] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    listCompanies()
      .then((data) => { setCompanies(data); setFiltered(data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(companies.filter((c) =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
    ));
  }, [search, companies]);

  async function handleImpersonate(company: CompanySummary) {
    setImpersonating(company.id);
    try {
      await impersonateCompany(company.id);
      router.push('/dashboard/reservations');
    } finally {
      setImpersonating(null);
    }
  }

  const columns = [
    { title: 'Empresa', dataIndex: 'name', key: 'name', render: (name: string) => <Text strong>{name}</Text> },
    { title: 'Email', dataIndex: 'email', key: 'email', responsive: ['md'] as never[] },
    { title: 'Ciudad', dataIndex: 'city', key: 'city', responsive: ['md'] as never[] },
    {
      title: 'Registrada',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['lg'] as never[],
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: unknown, record: CompanySummary) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => router.push(`/superadmin/companies/${record.id}`)}>
            Ver
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<LoginOutlined />}
            loading={impersonating === record.id}
            onClick={() => handleImpersonate(record)}
            style={{ background: colors.primary, borderColor: colors.primary }}
          >
            Acceder
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spin size="large" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: colors.secondary }}>Empresas registradas</Title>
          <Text type="secondary">{companies.length} empresa{companies.length !== 1 ? 's' : ''}</Text>
        </div>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Buscar por nombre, email o ciudad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: isMobile ? '100%' : 280 }}
          allowClear
        />
      </div>

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((c) => (
            <div key={c.id} style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16 }}>
              <Text strong style={{ display: 'block', fontSize: 15 }}>{c.name}</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>{c.email}</Text>
              <div style={{ marginTop: 4 }}>
                <Tag>{c.city}</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(c.createdAt).format('DD/MM/YYYY')}</Text>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button size="small" icon={<EyeOutlined />} onClick={() => router.push(`/superadmin/companies/${c.id}`)}>Ver</Button>
                <Button size="small" type="primary" icon={<LoginOutlined />} loading={impersonating === c.id}
                  onClick={() => handleImpersonate(c)}
                  style={{ background: colors.primary, borderColor: colors.primary }}>
                  Acceder
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          size="middle"
        />
      )}
    </div>
  );
}
