'use client';

import { useState } from 'react';
import { Table, Button, Tag, Space, Modal, Tooltip, Popconfirm, Card, Row, Col, Typography, Flex, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Grid } from 'antd';
import { useTranslations } from 'next-intl';
import type { ColumnsType } from 'antd/es/table';
import { Schedule, DAY_KEYS } from '../types/schedule.types';
import { ScheduleForm } from './ScheduleForm';
import { useSchedules } from '../hooks/useSchedules';
import { PageLayout } from '@/shared/components/PageLayout';

const { useBreakpoint } = Grid;
const { Text } = Typography;

export function ScheduleList() {
  const t = useTranslations('schedules');
  const tc = useTranslations('common');
  const { schedules, loading, reload, remove, toggle } = useSchedules();
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [adding, setAdding] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const renderDays = (days: string[]) => (
    <Space size={2} wrap>
      {DAY_KEYS.map((d) => (
        <Tag key={d} color={days.includes(d) ? 'blue' : 'default'} style={{ margin: 0, fontSize: 11 }}>
          {t(`daysShort.${d}`)}
        </Tag>
      ))}
    </Space>
  );

  const columns: ColumnsType<Schedule> = [
    { title: t('route'), dataIndex: 'routeLabel', key: 'route', render: (v) => v ?? '—' },
    {
      title: t('vehicle'), key: 'vehicle',
      render: (_, r) => (
        <Flex vertical gap={2}>
          <Text style={{ fontSize: 13 }}>{r.vehicleLabel ?? '—'}</Text>
          {r.vehicleDriver && (
            <Text type="secondary" style={{ fontSize: 11 }}>👤 {r.vehicleDriver}</Text>
          )}
        </Flex>
      ),
    },
    { title: t('departureTime'), dataIndex: 'departureTime', key: 'departureTime' },
    { title: t('days'), dataIndex: 'days', key: 'days', render: renderDays },
    { title: t('price'), dataIndex: 'price', key: 'price', render: (v) => `Bs. ${Number(v).toFixed(2)}` },
    {
      title: t('active'), dataIndex: 'active', key: 'active',
      render: (active, record) => (
        <Switch checked={active} size="small" onChange={() => toggle(record.id)} />
      ),
    },
    {
      title: tc('actions'), key: 'actions', width: 90,
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
      {schedules.map((s) => (
        <Col xs={24} key={s.id}>
          <Card size="small" style={{ borderRadius: 8 }}>
            <Flex justify="space-between" align="flex-start" gap={8}>
              <Flex vertical gap={6} style={{ flex: 1, minWidth: 0 }}>
                <Text strong>{s.routeLabel ?? s.routeId}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{s.vehicleLabel ?? s.vehicleId}</Text>
                {s.vehicleDriver && (
                  <Text type="secondary" style={{ fontSize: 12 }}>👤 {s.vehicleDriver}</Text>
                )}
                <Space size={4}>
                  <Tag color="geekblue">{s.departureTime}</Tag>
                  <Tag color="purple">Bs. {Number(s.price).toFixed(2)}</Tag>
                </Space>
                <div>{renderDays(s.days)}</div>
                <Space size={4}>
                  <Switch checked={s.active} size="small" onChange={() => toggle(s.id)} />
                  <Text type="secondary" style={{ fontSize: 12 }}>{s.active ? t('active') : t('inactive')}</Text>
                </Space>
              </Flex>
              <Space>
                <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setEditing(s)} />
                <Popconfirm title={t('deleteConfirm')} onConfirm={() => remove(s.id)} okText={tc('confirm')} cancelText={tc('cancel')}>
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
      {isMobile ? (
        loading ? <Text type="secondary">{tc('loading')}</Text> :
        schedules.length === 0 ? <Text type="secondary">{t('empty')}</Text> :
        mobileCards
      ) : (
        <Table columns={columns} dataSource={schedules} rowKey="id" loading={loading}
          pagination={false} locale={{ emptyText: t('empty') }} scroll={{ x: 800 }} />
      )}

      <Modal open={adding} onCancel={() => setAdding(false)} title={t('add')} footer={null} destroyOnHidden width={560}>
        <ScheduleForm onSuccess={() => { setAdding(false); reload(); }} onCancel={() => setAdding(false)} />
      </Modal>
      <Modal open={!!editing} onCancel={() => setEditing(null)} title={t('edit')} footer={null} destroyOnHidden width={560}>
        {editing && <ScheduleForm schedule={editing} onSuccess={() => { setEditing(null); reload(); }} onCancel={() => setEditing(null)} />}
      </Modal>
    </PageLayout>
  );
}
