'use client';

import { useState } from 'react';
import { Table, Button, Space, Modal, Alert, Tooltip, Popconfirm, Card, Row, Col, Typography, Flex } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Grid } from 'antd';
import { useTranslations } from 'next-intl';
import type { ColumnsType } from 'antd/es/table';
import { Route } from '../types/route.types';
import { RouteForm } from './RouteForm';
import { useRoutes } from '../hooks/useRoutes';
import { PageLayout } from '@/shared/components/PageLayout';

const { useBreakpoint } = Grid;
const { Text } = Typography;

export function RouteList() {
  const t = useTranslations('routes');
  const tc = useTranslations('common');
  const { routes, loading, error, reload, remove } = useRoutes();
  const [editing, setEditing] = useState<Route | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  async function handleDelete(id: string) {
    setDeleteError(null);
    try {
      await remove(id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      const knownKeys = ['route_has_active_schedules', 'delete_failed'];
      const key = knownKeys.includes(msg) ? msg : 'delete_failed';
      setDeleteError(t(`errors.${key}` as Parameters<typeof t>[0]));
    }
  }

  const columns: ColumnsType<Route> = [
    {
      title: `${t('origin')} → ${t('destination')}`,
      key: 'route',
      render: (_, r) => (
        <Space>
          <Text>{r.origin}</Text>
          <ArrowRightOutlined style={{ color: '#999' }} />
          <Text>{r.destination}</Text>
        </Space>
      ),
    },
    {
      title: t('basePrice'), dataIndex: 'basePrice', key: 'basePrice',
      render: (v) => `Bs. ${Number(v).toFixed(2)}`,
    },
    {
      title: tc('actions'), key: 'actions', width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title={tc('edit')}>
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setEditing(record)} />
          </Tooltip>
          <Popconfirm title={t('deleteConfirm')} onConfirm={() => handleDelete(record.id)} okText={tc('confirm')} cancelText={tc('cancel')}>
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
      {routes.map((r) => (
        <Col xs={24} key={r.id}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <Flex justify="space-between" align="flex-start">
              <Flex vertical gap={4}>
                <Space>
                  <Text strong>{r.origin}</Text>
                  <ArrowRightOutlined style={{ color: '#999' }} />
                  <Text strong>{r.destination}</Text>
                </Space>
                <Text type="secondary">Bs. {Number(r.basePrice).toFixed(2)}</Text>
              </Flex>
              <Space>
                <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setEditing(r)} />
                <Popconfirm title={t('deleteConfirm')} onConfirm={() => handleDelete(r.id)} okText={tc('confirm')} cancelText={tc('cancel')}>
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
      {deleteError && <Alert title={deleteError} type="error" showIcon closable onClose={() => setDeleteError(null)} style={{ marginBottom: 16 }} />}

      {isMobile ? (
        loading ? <Text type="secondary">{tc('loading')}</Text> :
        routes.length === 0 ? <Text type="secondary">{t('empty')}</Text> :
        mobileCards
      ) : (
        <Table columns={columns} dataSource={routes} rowKey="id" loading={loading} pagination={false} locale={{ emptyText: t('empty') }} />
      )}

      <Modal open={adding} onCancel={() => setAdding(false)} title={t('add')} footer={null} destroyOnHidden>
        <RouteForm onSuccess={() => { setAdding(false); reload(); }} onCancel={() => setAdding(false)} />
      </Modal>
      <Modal open={!!editing} onCancel={() => setEditing(null)} title={t('edit')} footer={null} destroyOnHidden>
        {editing && <RouteForm route={editing} onSuccess={() => { setEditing(null); reload(); }} onCancel={() => setEditing(null)} />}
      </Modal>
    </PageLayout>
  );
}
