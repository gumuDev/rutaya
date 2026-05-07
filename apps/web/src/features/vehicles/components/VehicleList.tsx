'use client';

import { useState } from 'react';
import { Table, Button, Tag, Space, Modal, Alert, Tooltip, Popconfirm, Card, Row, Col, Typography, Flex } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Grid } from 'antd';
import { useTranslations } from 'next-intl';
import type { ColumnsType } from 'antd/es/table';
import { Vehicle } from '../types/vehicle.types';
import { VehicleForm } from './VehicleForm';
import { useVehicles } from '../hooks/useVehicles';
import { PageLayout } from '@/shared/components/PageLayout';

const { useBreakpoint } = Grid;
const { Text } = Typography;
const typeColors = { trufi: 'blue', minibus: 'green', bus: 'orange' } as const;

export function VehicleList() {
  const t = useTranslations('vehicles');
  const tc = useTranslations('common');
  const { vehicles, loading, error, reload, remove } = useVehicles();
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [adding, setAdding] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns: ColumnsType<Vehicle> = [
    { title: t('plate'), dataIndex: 'plate', key: 'plate', render: (v) => <Text strong>{v}</Text> },
    {
      title: t('type'), dataIndex: 'type', key: 'type',
      render: (type: keyof typeof typeColors) => (
        <Tag color={typeColors[type]}>{t(`types.${type}`)}</Tag>
      ),
    },
    {
      title: 'Vehículo', key: 'vehicle',
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {[r.brand, r.year].filter(Boolean).join(' · ') || '—'}
        </Text>
      ),
    },
    { title: t('capacity'), dataIndex: 'capacity', key: 'capacity', render: (v) => `${v} pax` },
    {
      title: t('driverName'), key: 'driver',
      render: (_, r) => r.driverName
        ? <><UserOutlined style={{ marginRight: 4 }} />{r.driverName}</>
        : <Text type="secondary">—</Text>,
    },
    {
      title: tc('actions'), key: 'actions', width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title={tc('edit')}>
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setEditing(record)} />
          </Tooltip>
          <Popconfirm title={t('deleteConfirm')} onConfirm={() => remove(record.id)} okText={tc('confirm')} cancelText={tc('cancel')}>
            <Tooltip title={tc('delete')}>
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const mobileCards = (
    <Row gutter={[12, 12]}>
      {vehicles.map((v) => (
        <Col xs={24} key={v.id}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <Flex justify="space-between" align="flex-start">
              <Flex vertical gap={4}>
                <Text strong style={{ fontSize: 15 }}>{v.plate}</Text>
                <Space size={6} wrap>
                  <Tag color={typeColors[v.type]} style={{ margin: 0 }}>{t(`types.${v.type}`)}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>{v.capacity} pax</Text>
                  {(v.brand || v.year) && (
                    <Text type="secondary" style={{ fontSize: 12 }}>{[v.brand, v.year].filter(Boolean).join(' ')}</Text>
                  )}
                </Space>
                {v.driverName && (
                  <Text style={{ fontSize: 12 }}><UserOutlined style={{ marginRight: 4 }} />{v.driverName}</Text>
                )}
              </Flex>
              <Space>
                <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setEditing(v)} />
                <Popconfirm title={t('deleteConfirm')} onConfirm={() => remove(v.id)} okText={tc('confirm')} cancelText={tc('cancel')}>
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              </Space>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <PageLayout
      title={t('title')}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAdding(true)}>
          {isMobile ? null : t('add')}
        </Button>
      }
    >
      {error && <Alert title={t('errors.load_failed')} type="error" showIcon style={{ marginBottom: 16 }} />}

      {isMobile ? (
        loading ? <Text type="secondary">{tc('loading')}</Text> :
        vehicles.length === 0 ? <Text type="secondary">{t('empty')}</Text> :
        mobileCards
      ) : (
        <Table
          columns={columns}
          dataSource={vehicles}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{ emptyText: t('empty') }}
        />
      )}

      <Modal open={adding} onCancel={() => setAdding(false)} title={t('add')} footer={null} destroyOnHidden>
        <VehicleForm onSuccess={() => { setAdding(false); reload(); }} onCancel={() => setAdding(false)} />
      </Modal>
      <Modal open={!!editing} onCancel={() => setEditing(null)} title={t('edit')} footer={null} destroyOnHidden>
        {editing && (
          <VehicleForm vehicle={editing} onSuccess={() => { setEditing(null); reload(); }} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </PageLayout>
  );
}
