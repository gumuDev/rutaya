'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Alert, Card, Typography, Divider, Image, Spin, Upload } from 'antd';
import { BankOutlined, QrcodeOutlined, SendOutlined, UploadOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { getToken } from '@/features/auth/hooks/useAuth';
import { PageLayout } from '@/shared/components/PageLayout';
import { colors } from '@/shared/theme/colors';
import { uploadImage } from '@/shared/services/upload.service';
import type { RcFile } from 'antd/es/upload';

const { Text } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('request_failed');
  return res.json();
}

interface PaymentConfigData {
  bankName: string | null;
  bankAccount: string | null;
  bankAccountHolder: string | null;
  qrImageUrl: string | null;
  telegramChatId: string | null;
}

export function PaymentConfig() {
  const t = useTranslations('paymentConfig');
  const tc = useTranslations('common');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PaymentConfigData | null>(null);

  useEffect(() => {
    authFetch('/companies/payment-config')
      .then((data: PaymentConfigData) => {
        setInitialValues(data);
        if (data.qrImageUrl) setQrPreview(data.qrImageUrl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(file: RcFile) {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      setQrPreview(url);
      form.setFieldValue('qrImageUrl', url);
    } catch {
      setUploadError('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
    return false;
  }

  function handleRemoveQr() {
    setQrPreview(null);
    form.setFieldValue('qrImageUrl', null);
  }

  async function handleSubmit(values: PaymentConfigData) {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await authFetch('/companies/payment-config', {
        method: 'PATCH',
        body: JSON.stringify({ ...values, qrImageUrl: qrPreview }),
      });
      setSuccess(true);
      setInitialValues((prev) => prev ? { ...prev, qrImageUrl: qrPreview } : prev);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(tc('error'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <Spin size="large" />
    </div>
  );

  const hasPaymentMethod = !!(
    initialValues?.bankAccount ||
    initialValues?.qrImageUrl
  );

  return (
    <PageLayout title={t('title')}>
      {!hasPaymentMethod && (
        <Alert
          title={t('noPaymentMethods')}
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} initialValues={initialValues ?? {}}>
        {success && <Alert title={t('saved')} type="success" showIcon style={{ marginBottom: 16 }} />}
        {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        {/* Banco */}
        <Card
          title={<><BankOutlined style={{ color: colors.secondary, marginRight: 8 }} />{t('bankSection')}</>}
          style={{ marginBottom: 20, borderRadius: 10 }}
        >
          <Form.Item name="bankName" label={t('bankName')}>
            <Input placeholder="Ej. Banco BCP, Banco Unión..." />
          </Form.Item>
          <Form.Item name="bankAccount" label={t('bankAccount')}>
            <Input placeholder="Ej. 1234567890" />
          </Form.Item>
          <Form.Item name="bankAccountHolder" label={t('bankAccountHolder')} style={{ marginBottom: 0 }}>
            <Input placeholder="Ej. Juan Pérez" />
          </Form.Item>
        </Card>

        {/* QR */}
        <Card
          title={<><QrcodeOutlined style={{ color: colors.primary, marginRight: 8 }} />{t('qrSection')}</>}
          style={{ marginBottom: 20, borderRadius: 10 }}
        >
          <Form.Item name="qrImageUrl" hidden><Input /></Form.Item>

          {uploadError && <Alert title={uploadError} type="error" showIcon style={{ marginBottom: 12 }} />}

          {!qrPreview ? (
            <Upload accept="image/*" showUploadList={false} beforeUpload={handleUpload}>
              <Button icon={<UploadOutlined />} loading={uploading} size="large"
                style={{ borderStyle: 'dashed', borderColor: colors.primary, color: colors.primary, width: '100%' }}>
                {uploading ? 'Subiendo imagen...' : 'Subir imagen QR'}
              </Button>
            </Upload>
          ) : (
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Image src={qrPreview} alt="QR de pago" width={160}
                  style={{ borderRadius: 8, border: `1px solid ${colors.border}` }} />
                <div style={{ position: 'absolute', top: -8, right: -8 }}>
                  <Button type="primary" danger shape="circle" size="small"
                    icon={<DeleteOutlined />} onClick={handleRemoveQr} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircleOutlined style={{ color: colors.success }} />
                  <Text style={{ color: colors.success, fontSize: 13 }}>Imagen cargada</Text>
                </div>
                <Upload accept="image/*" showUploadList={false} beforeUpload={handleUpload}>
                  <Button icon={<UploadOutlined />} loading={uploading} size="small">
                    Cambiar imagen
                  </Button>
                </Upload>
              </div>
            </div>
          )}

          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 10 }}>
            Sube la imagen del código QR de tu cuenta de pago (Tigo Money, billetera, etc.)
          </Text>
        </Card>

        {/* Telegram */}
        <Card
          title={<><SendOutlined style={{ color: '#0088cc', marginRight: 8 }} />{t('telegramSection')}</>}
          style={{ marginBottom: 20, borderRadius: 10 }}
        >
          <Form.Item
            name="telegramChatId"
            label={t('telegramChatId')}
            extra={<Text type="secondary" style={{ fontSize: 12 }}>{t('telegramHelp')}</Text>}
          >
            <Input placeholder="Ej. 123456789" />
          </Form.Item>
        </Card>

        <Divider />
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={saving}
          style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}
        >
          {t('save')}
        </Button>
      </Form>
    </PageLayout>
  );
}
