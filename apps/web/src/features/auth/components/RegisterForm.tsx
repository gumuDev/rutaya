'use client';

import { Form, Input, Button, Alert, Typography, Card } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerCompany, loginCompany } from '../services/auth.service';
import { saveSession } from '../hooks/useAuth';

const { Text, Title } = Typography;

export function RegisterForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: { name: string; taxId?: string; phone: string; city: string; email: string; password: string }) {
    setError(null);
    setLoading(true);
    try {
      await registerCompany(values);
      const session = await loginCompany({ email: values.email, password: values.password });
      saveSession(session.accessToken, session.companyId, session.companyName, session.role);
      router.push('/dashboard');
    } catch (err) {
      const key = err instanceof Error ? err.message : 'register_failed';
      setError(t(`errors.${key}` as Parameters<typeof t>[0]));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{ width: 480 }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>{t('register')}</Title>
    <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
      {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form.Item name="name" label={t('companyName')} rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="taxId" label={t('taxId')}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="phone" label={t('phone')} rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="city" label={t('city')} rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="email" label={t('email')} rules={[{ required: true, type: 'email' }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="password" label={t('password')} rules={[{ required: true, min: 8, message: t('passwordMin') }]}>
        <Input.Password size="large" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large" loading={loading}>
        {t('registerSubmit')}
      </Button>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text>{t('hasAccount')} <a href="/login">{t('login')}</a></Text>
      </div>
    </Form>
    </Card>
  );
}
