'use client';

import { Form, Select, TimePicker, Checkbox, InputNumber, Button, Alert, Row, Col } from 'antd';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import dayjs from '@/shared/lib/dayjs';
import { Schedule, CreateSchedulePayload, DAY_KEYS } from '../types/schedule.types';
import { createSchedule, updateSchedule } from '../services/schedules.service';
import { listRoutes } from '@/features/routes/services/routes.service';
import { listVehicles } from '@/features/vehicles/services/vehicles.service';
import type { Route } from '@/features/routes/types/route.types';
import type { Vehicle } from '@/features/vehicles/types/vehicle.types';

interface Props {
  schedule?: Schedule;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleForm({ schedule, onSuccess, onCancel }: Props) {
  const t = useTranslations('schedules');
  const tc = useTranslations('common');
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    listRoutes().then(setRoutes).catch(() => {});
    listVehicles().then(setVehicles).catch(() => {});
  }, []);

  function handleRouteChange(routeId: string) {
    const route = routes.find((r) => r.id === routeId);
    if (route) {
      form.setFieldValue('price', route.basePrice);
    }
  }

  async function handleSubmit(values: { routeId: string; vehicleId: string; departureTime: dayjs.Dayjs; days: string[]; price: number }) {
    setError(null);
    setLoading(true);
    try {
      const payload: CreateSchedulePayload = {
        routeId: values.routeId,
        vehicleId: values.vehicleId,
        departureTime: values.departureTime.format('HH:mm'),
        days: values.days,
        price: values.price,
      };
      if (schedule) {
        await updateSchedule(schedule.id, { departureTime: payload.departureTime, days: payload.days, price: payload.price });
      } else {
        await createSchedule(payload);
      }
      onSuccess();
    } catch {
      setError(t('errors.save_failed'));
    } finally {
      setLoading(false);
    }
  }

  const dayOptions = DAY_KEYS.map((d) => ({ label: t(`daysShort.${d}`), value: d }));

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      initialValues={{
        routeId: schedule?.routeId,
        vehicleId: schedule?.vehicleId,
        departureTime: schedule ? dayjs(schedule.departureTime, 'HH:mm') : undefined,
        days: schedule?.days ?? [],
        price: schedule?.price,
      }}
    >
      {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form.Item name="routeId" label={t('route')} rules={[{ required: true }]}>
        <Select
          disabled={!!schedule}
          options={routes.map((r) => ({ value: r.id, label: `${r.origin} → ${r.destination}` }))}
          onChange={handleRouteChange}
        />
      </Form.Item>
      <Form.Item name="vehicleId" label={t('vehicle')} rules={[{ required: true }]}>
        <Select
          disabled={!!schedule}
          options={vehicles.map((v) => ({ value: v.id, label: `${v.plate} (${v.capacity} pax)` }))}
        />
      </Form.Item>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="departureTime" label={t('departureTime')} rules={[{ required: true }]}>
            <TimePicker format="HH:mm" minuteStep={5} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="price" label={t('price')} rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} prefix="Bs." style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="days" label={t('days')} rules={[{ required: true }]}>
        <Checkbox.Group options={dayOptions} />
      </Form.Item>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>{tc('cancel')}</Button>
        <Button type="primary" htmlType="submit" loading={loading}>{tc('save')}</Button>
      </div>
    </Form>
  );
}
