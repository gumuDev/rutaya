'use client';

import { Form, Input, Button, Alert, Typography, Card } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginCompany } from '../services/auth.service';
import { saveSession } from '../hooks/useAuth';

const { Text, Title } = Typography;

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: { email: string; password: string }) {
    setError(null);
    setLoading(true);
    try {
      const res = await loginCompany(values);
      saveSession(res.accessToken, res.companyId, res.companyName, res.role);
      router.push(res.role === 'superadmin' ? '/superadmin/companies' : '/dashboard');
    } catch (err) {
      const key = err instanceof Error ? err.message : 'login_failed';
      setError(t(`errors.${key}` as Parameters<typeof t>[0]));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{ width: 400 }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>{t('login')}</Title>
    <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
      {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form.Item name="email" label={t('email')} rules={[{ required: true, type: 'email' }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="password" label={t('password')} rules={[{ required: true, min: 8, message: t('passwordMin') }]}>
        <Input.Password size="large" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large" loading={loading}>
        {t('loginSubmit')}
      </Button>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text>{t('noAccount')} <a href="/register">{t('register')}</a></Text>
      </div>
    </Form>
    </Card>
  );
}
