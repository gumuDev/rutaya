'use client';

import { useState } from 'react';
import { Form, Input, Button, Alert, Card, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { colors } from '@/shared/theme/colors';

const { Title, Text } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function RecoverPage() {
  const t = useTranslations('recover');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(values: { code: string }) {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(
        `${API_URL}/reservations/recover?code=${encodeURIComponent(values.code.toUpperCase())}`
      );
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json();
      router.push(`/ticket/${data.code}`);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card style={{ width: '100%', maxWidth: 400, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            <span style={{ color: colors.primary }}>Ruta</span>
            <span style={{ color: colors.secondary }}>Ya</span>
          </Title>
          <Title level={4} style={{ marginTop: 8, marginBottom: 4 }}>{t('title')}</Title>
          <Text type="secondary">{t('subtitle')}</Text>
        </div>

        {notFound && <Alert title={t('notFound')} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item name="code" label={t('code')} rules={[{ required: true }]}>
            <Input
              size="large"
              placeholder={t('codePlaceholder')}
              style={{ textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'monospace', fontSize: 18 }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large"
            icon={<SearchOutlined />} loading={loading}
            style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
            {t('search')}
          </Button>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Button type="link" href="/" style={{ color: colors.textSecondary }}>{t('backToHome')}</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
