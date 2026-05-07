'use client';

import { useState } from 'react';
import {
  Table, Tag, Button, Space, Popconfirm, Select, Card,
  Row, Col, Statistic, Alert, Typography, Flex, Grid, DatePicker,
} from 'antd';
import {
  CheckOutlined, CloseOutlined, LoginOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import type { ColumnsType } from 'antd/es/table';
import dayjs from '@/shared/lib/dayjs';
import { useReservations } from '../hooks/useReservations';
import { PageLayout } from '@/shared/components/PageLayout';
import { colors } from '@/shared/theme/colors';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const statusColors: Record<string, string> = {
  pending_payment: 'red', pending: 'orange', confirmed: 'green',
  cancelled: 'default', expired: 'default', boarded: 'blue',
};

interface Reservation {
  id: string;
  code: string;
  status: string;
  passengerName: string;
  passengerPhone: string;
  quantity: number;
  paymentMethod: string | null;
  proofImageUrl: string | null;
  createdAt: string;
  schedule: {
    departureTime: string;
    route: { origin: string; destination: string };
  };
}

export function ReservationsList() {
  const t = useTranslations('reservations');
  const tc = useTranslations('common');
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [dateFilter, setDateFilter] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const { reservations, loading, error, reload, confirm, cancel, board } = useReservations(statusFilter, dateFilter);

  const data = reservations as Reservation[];

  const stats = {
    total: data.length,
    pending: data.filter((r) => r.status === 'pending_payment' || r.status === 'pending').length,
    confirmed: data.filter((r) => r.status === 'confirmed').length,
    boarded: data.filter((r) => r.status === 'boarded').length,
  };

  const actionButtons = (record: Reservation) => (
    <Space size={4}>
      {(record.status === 'pending' || record.status === 'pending_payment') && (
        <Popconfirm title={t('confirm') + '?'} onConfirm={() => confirm(record.code)} okText={tc('confirm')} cancelText={tc('cancel')}>
          <Button type="text" size="small" icon={<CheckOutlined />} style={{ color: colors.success }} />
        </Popconfirm>
      )}
      {(record.status === 'pending' || record.status === 'pending_payment' || record.status === 'confirmed') && (
        <Popconfirm title={t('cancel') + '?'} onConfirm={() => cancel(record.code)} okText={tc('confirm')} cancelText={tc('cancel')}>
          <Button type="text" size="small" danger icon={<CloseOutlined />} />
        </Popconfirm>
      )}
      {(record.status === 'pending' || record.status === 'confirmed') && (
        <Popconfirm title={t('board') + '?'} onConfirm={() => board(record.code)} okText={tc('confirm')} cancelText={tc('cancel')}>
          <Button type="text" size="small" icon={<LoginOutlined />} style={{ color: colors.secondary }} />
        </Popconfirm>
      )}
    </Space>
  );

  const columns: ColumnsType<Reservation> = [
    { title: t('code'), dataIndex: 'code', key: 'code', render: (v) => <Text code style={{ fontSize: 13 }}>{v}</Text> },
    { title: t('passenger'), dataIndex: 'passengerName', key: 'passenger' },
    { title: t('phone'), dataIndex: 'passengerPhone', key: 'phone' },
    {
      title: t('route'), key: 'route',
      render: (_, r) => `${r.schedule.route.origin} → ${r.schedule.route.destination}`,
    },
    { title: t('departure'), key: 'departure', render: (_, r) => r.schedule.departureTime },
    { title: t('quantity'), dataIndex: 'quantity', key: 'quantity', render: (v) => `${v} pax`, width: 60 },
    {
      title: t('status'), dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{t(`statuses.${s}` as Parameters<typeof t>[0])}</Tag>,
    },
    {
      title: 'Comprobante', key: 'proof', width: 100,
      render: (_, r) => r.proofImageUrl
        ? <a href={r.proofImageUrl} target="_blank" rel="noreferrer" style={{ color: colors.primary }}>Ver foto</a>
        : <Text type="secondary" style={{ fontSize: 11 }}>Sin comprobante</Text>,
    },
    { title: t('actions'), key: 'actions', width: 110, render: (_, r) => actionButtons(r) },
  ];

  const mobileCards = data.map((r) => (
    <Card key={r.id} size="small" style={{ borderRadius: 8, borderLeft: `4px solid ${statusColors[r.status] === 'orange' ? '#fa8c16' : statusColors[r.status] === 'green' ? '#52c41a' : '#d9d9d9'}` }}>
      <Flex justify="space-between" align="flex-start">
        <Flex vertical gap={4}>
          <Space size={6}>
            <Text code style={{ fontSize: 13 }}>{r.code}</Text>
            <Tag color={statusColors[r.status]} style={{ margin: 0 }}>{t(`statuses.${r.status}` as Parameters<typeof t>[0])}</Tag>
          </Space>
          <Text strong>{r.passengerName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.passengerPhone}</Text>
          <Text style={{ fontSize: 12 }}>{r.schedule.route.origin} → {r.schedule.route.destination} · {r.schedule.departureTime}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.quantity} pax</Text>
        </Flex>
        <div>{actionButtons(r)}</div>
      </Flex>
    </Card>
  ));

  const filters = (
    <Space wrap>
      <DatePicker
        value={dateFilter ? dayjs(dateFilter) : null}
        onChange={(d) => setDateFilter(d ? d.format('YYYY-MM-DD') : '')}
        placeholder="Fecha"
        size="small"
        allowClear
      />
      <Select
        placeholder={t('filterByStatus')}
        allowClear
        size="small"
        style={{ width: 150 }}
        value={statusFilter}
        onChange={setStatusFilter}
        options={['pending_payment', 'pending', 'confirmed', 'cancelled', 'expired', 'boarded'].map((s) => ({
          value: s,
          label: t(`statuses.${s}` as Parameters<typeof t>[0]),
        }))}
      />
      <Button size="small" icon={<ReloadOutlined />} onClick={reload} />
    </Space>
  );

  return (
    <PageLayout title={t('title')} actions={filters}>
      {/* Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        {[
          { label: t('stats.total'), value: stats.total, color: colors.secondary },
          { label: t('stats.pending'), value: stats.pending, color: '#fa8c16' },
          { label: t('stats.confirmed'), value: stats.confirmed, color: colors.success },
          { label: t('stats.boarded'), value: stats.boarded, color: '#1677ff' },
        ].map(({ label, value, color }) => (
          <Col xs={12} sm={6} key={label}>
            <Card size="small" style={{ borderRadius: 8, borderTop: `3px solid ${color}` }}>
              <Statistic title={<Text style={{ fontSize: 12 }}>{label}</Text>} value={value}
                styles={{ content: { color, fontSize: 24, fontWeight: 700 } }} />
            </Card>
          </Col>
        ))}
      </Row>

      {error && <Alert title={t('errors.load_failed')} type="error" showIcon style={{ marginBottom: 16 }} />}

      {isMobile ? (
        loading ? <Text type="secondary">{tc('loading')}</Text> :
        data.length === 0 ? <Text type="secondary">{t('empty')}</Text> :
        <Flex vertical gap={8}>{mobileCards}</Flex>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: t('empty') }}
          size="middle"
        />
      )}
    </PageLayout>
  );
}
