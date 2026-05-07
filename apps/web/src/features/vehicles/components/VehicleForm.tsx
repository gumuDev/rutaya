'use client';

import { Form, Input, InputNumber, Select, Button, Alert, Divider, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Vehicle, VehicleType, ServiceType, CreateVehiclePayload } from '../types/vehicle.types';
import { createVehicle, updateVehicle } from '../services/vehicles.service';

const { Text } = Typography;

interface Props {
  vehicle?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VehicleForm({ vehicle, onSuccess, onCancel }: Props) {
  const t = useTranslations('vehicles');
  const tc = useTranslations('common');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleType>(vehicle?.type ?? VehicleType.TRUFI);

  const typeOptions = [
    { value: VehicleType.TRUFI, label: `${t('types.trufi')} — ${t('typeHint.trufi')}` },
    { value: VehicleType.MINIBUS, label: `${t('types.minibus')} — ${t('typeHint.minibus')}` },
    { value: VehicleType.BUS, label: `${t('types.bus')} — ${t('typeHint.bus')}` },
  ];

  const serviceTypeOptions = [
    { value: ServiceType.NORMAL, label: t('serviceTypes.normal') },
    { value: ServiceType.SEMICAMA, label: t('serviceTypes.semicama') },
    { value: ServiceType.CAMA, label: t('serviceTypes.cama') },
    { value: ServiceType.LEITO, label: t('serviceTypes.leito') },
  ];

  async function handleSubmit(values: CreateVehiclePayload) {
    setError(null);
    setLoading(true);
    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, values);
      } else {
        await createVehicle(values);
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
      initialValues={{
        plate: vehicle?.plate,
        type: vehicle?.type ?? VehicleType.TRUFI,
        serviceType: vehicle?.serviceType ?? ServiceType.NORMAL,
        capacity: vehicle?.capacity ?? 4,
        brand: vehicle?.brand,
        year: vehicle?.year,
        driverName: vehicle?.driverName,
        driverPhone: vehicle?.driverPhone,
      }}
    >
      {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {/* Datos del vehículo */}
      <Form.Item name="plate" label={t('plate')} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="type" label={t('type')} rules={[{ required: true }]}>
        <Select options={typeOptions} onChange={(v: VehicleType) => setSelectedType(v)} />
      </Form.Item>
      {selectedType === VehicleType.BUS && (
        <Form.Item name="serviceType" label={t('serviceType')} rules={[{ required: true }]}>
          <Select options={serviceTypeOptions} />
        </Form.Item>
      )}
      <Form.Item name="capacity" label={t('capacity')} rules={[{ required: true }]}>
        <InputNumber min={1} max={100} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="brand" label={t('brand')}>
        <Input placeholder="Toyota, Volvo, Mercedes..." />
      </Form.Item>
      <Form.Item name="year" label={t('year')}>
        <InputNumber min={1990} max={new Date().getFullYear() + 1} style={{ width: '100%' }} placeholder="2020" />
      </Form.Item>

      {/* Datos del chofer */}
      <Divider style={{ margin: '12px 0' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>{t('driverSection')}</Text>
      </Divider>
      <Form.Item name="driverName" label={t('driverName')}>
        <Input placeholder="Nombre completo del chofer" />
      </Form.Item>
      <Form.Item name="driverPhone" label={t('driverPhone')}>
        <Input placeholder="+591 70000000" />
      </Form.Item>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>{tc('cancel')}</Button>
        <Button type="primary" htmlType="submit" loading={loading}>{tc('save')}</Button>
      </div>
    </Form>
  );
}
