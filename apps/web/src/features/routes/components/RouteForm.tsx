'use client';

import { Form, InputNumber, Button, Alert, AutoComplete } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Route, CreateRoutePayload } from '../types/route.types';
import { createRoute, updateRoute } from '../services/routes.service';
import { useCities } from '@/features/reservations/hooks/useCities';

interface Props {
  route?: Route;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RouteForm({ route, onSuccess, onCancel }: Props) {
  const t = useTranslations('routes');
  const tc = useTranslations('common');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [originQuery, setOriginQuery] = useState(route?.origin ?? '');
  const [destinationQuery, setDestinationQuery] = useState(route?.destination ?? '');
  const { options: originOptions } = useCities(originQuery);
  const { options: destinationOptions } = useCities(destinationQuery);

  async function handleSubmit(values: CreateRoutePayload) {
    setError(null);
    setLoading(true);
    try {
      if (route) {
        await updateRoute(route.id, values);
      } else {
        await createRoute(values);
      }
      onSuccess();
    } catch {
      setError(t('errors.save_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      initialValues={{ origin: route?.origin, destination: route?.destination, basePrice: route?.basePrice }}
    >
      {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form.Item name="origin" label={t('origin')} rules={[{ required: true }]}>
        <AutoComplete
          options={originOptions}
          onSearch={setOriginQuery}
          filterOption={false}
          placeholder={t('origin')}
        />
      </Form.Item>
      <Form.Item name="destination" label={t('destination')} rules={[{ required: true }]}>
        <AutoComplete
          options={destinationOptions}
          onSearch={setDestinationQuery}
          filterOption={false}
          placeholder={t('destination')}
        />
      </Form.Item>
      <Form.Item name="basePrice" label={t('basePrice')} rules={[{ required: true }]}>
        <InputNumber min={0} precision={2} style={{ width: '100%' }} prefix="Bs." />
      </Form.Item>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>{tc('cancel')}</Button>
        <Button type="primary" htmlType="submit" loading={loading}>{tc('save')}</Button>
      </div>
    </Form>
  );
}
