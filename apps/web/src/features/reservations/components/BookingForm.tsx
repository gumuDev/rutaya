'use client';

import { Form, Input, InputNumber, Button, Alert, Card, Typography, Divider, Steps, Radio, Image, Upload } from 'antd';
import { BankOutlined, QrcodeOutlined, ArrowLeftOutlined, UploadOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createReservation, getSeats } from '../services/reservations.service';
import { ScheduleResult, PaymentMethod, SeatsResponse } from '../types/reservation.types';
import { SeatMap } from './SeatMap';
import { colors } from '@/shared/theme/colors';
import { uploadImage } from '@/shared/services/upload.service';
import type { RcFile } from 'antd/es/upload';

const { Text, Title } = Typography;

interface PassengerEntry {
  name: string;
  phone: string;
}

interface Props {
  schedule: ScheduleResult;
  initialPassengers?: number;
  travelDate: string;
}

interface Step1Values {
  passengers: PassengerEntry[];
  quantity: number;
  paymentMethod: PaymentMethod;
}

export function BookingForm({ schedule, initialPassengers = 1, travelDate }: Props) {
  const t = useTranslations('booking');
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [step1Values, setStep1Values] = useState<Step1Values | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(initialPassengers);

  const isBus = schedule.vehicleType === 'bus';
  const [seatsData, setSeatsData] = useState<SeatsResponse | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  useEffect(() => {
    if (isBus) {
      getSeats(schedule.id, travelDate).then(setSeatsData).catch(() => {});
    }
  }, [isBus, schedule.id, travelDate]);

  function toggleSeat(seat: number) {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  }

  const hasBankTransfer = !!(schedule.payment.bankName && schedule.payment.bankAccount);
  const hasQr = !!schedule.payment.qrImageUrl;
  const hasPaymentMethods = hasBankTransfer || hasQr;

  const effectiveQuantity = isBus ? selectedSeats.length || initialPassengers : quantity;
  const totalAmount = Number(schedule.price) * effectiveQuantity;

  async function handleStep2Submit() {
    if (!step1Values) return;
    setError(null);
    setLoading(true);
    try {
      const qty = isBus ? selectedSeats.length : step1Values.quantity;
      const results = await Promise.all(
        step1Values.passengers.map((p, idx) =>
          createReservation({
            scheduleId: schedule.id,
            passengerName: p.name,
            passengerPhone: p.phone,
            quantity: 1,
            paymentMethod: step1Values.paymentMethod,
            proofImageUrl: proofUrl || undefined,
            travelDate,
            selectedSeats: isBus ? [selectedSeats[idx]] : undefined,
          })
        )
      );
      const codes = results.map((r) => r.reservation.code);
      if (codes.length === 1) {
        router.push(`/ticket/${codes[0]}`);
      } else {
        router.push(`/tickets?codes=${codes.join(',')}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'request_failed';
      const knownKeys = ['schedule_not_found', 'schedule_inactive', 'insufficient_capacity', 'request_failed'];
      const key = knownKeys.includes(msg) ? msg : 'request_failed';
      setError(t(`errors.${key}` as Parameters<typeof t>[0]));
    } finally {
      setLoading(false);
    }
  }

  const summaryCard = (
    <div style={{ background: colors.accent, borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
      <Text strong style={{ display: 'block' }}>{schedule.origin} → {schedule.destination}</Text>
      <Text type="secondary">{schedule.departureTime} · {schedule.companyName}</Text>
      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <Text>
          {isBus && selectedSeats.length > 0
            ? `Asientos: ${selectedSeats.sort((a, b) => a - b).join(', ')}`
            : `${effectiveQuantity} pax`}
        </Text>
        <Text strong style={{ color: colors.primary, fontSize: 16 }}>
          Bs. {totalAmount.toFixed(2)}
        </Text>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px 16px' }}>
      <Steps
        current={step}
        items={[{ title: t('step1') }, { title: t('step2') }]}
        style={{ marginBottom: 24 }}
        size="small"
      />

      {summaryCard}

      {step === 0 && (
        <Card style={{ borderRadius: 10 }}>
          {!hasPaymentMethods && (
            <Alert title={t('noPaymentConfigured')} type="warning" showIcon style={{ marginBottom: 16 }} />
          )}
          <Form
            layout="vertical"
            onFinish={(values: { passengers: PassengerEntry[]; quantity: number; paymentMethod: PaymentMethod }) => {
              if (isBus && selectedSeats.length === 0) return;
              const effectiveQty = isBus ? selectedSeats.length : (values.quantity ?? 1);
              // Ensure passengers array has the right length
              const passengers: PassengerEntry[] = Array.from({ length: effectiveQty }, (_, i) => ({
                name: values.passengers?.[i]?.name ?? '',
                phone: values.passengers?.[i]?.phone ?? '',
              }));
              setStep1Values({ passengers, quantity: effectiveQty, paymentMethod: values.paymentMethod });
              setStep(1);
            }}
            requiredMark={false}
            initialValues={{ quantity: initialPassengers, paymentMethod: hasBankTransfer ? 'bank_transfer' : 'qr' }}
          >
            {/* Seat map for bus */}
            {isBus && seatsData ? (
              <Form.Item label="Selecciona tus asientos">
                <SeatMap
                  capacity={seatsData.capacity}
                  serviceType={seatsData.serviceType as 'normal' | 'semicama' | 'cama' | 'leito'}
                  takenSeats={seatsData.takenSeats}
                  selectedSeats={selectedSeats}
                  onToggle={toggleSeat}
                  maxSelect={20}
                />
                {selectedSeats.length === 0 && (
                  <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>Selecciona al menos un asiento</div>
                )}
              </Form.Item>
            ) : !isBus ? (
              <Form.Item name="quantity" label={t('quantity')} rules={[{ required: true }]}>
                <InputNumber min={1} max={schedule.available} size="large" style={{ width: '100%' }}
                  onChange={(v) => setQuantity(v ?? 1)} />
              </Form.Item>
            ) : null}

            {/* Passenger rows */}
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ marginBottom: 8 }}>
              <Text strong style={{ fontSize: 13 }}>
                <UserOutlined style={{ marginRight: 6 }} />
                Datos de {isBus ? selectedSeats.length || initialPassengers : quantity} pasajero{(isBus ? selectedSeats.length || initialPassengers : quantity) > 1 ? 's' : ''}
              </Text>
            </div>

            {Array.from({ length: isBus ? (selectedSeats.length || initialPassengers) : quantity }, (_, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 12px 4px', marginBottom: 10, border: `1px solid ${colors.border}` }}>
                {(isBus ? selectedSeats.length || initialPassengers : quantity) > 1 && (
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                    Pasajero {i + 1}{isBus && selectedSeats[i] ? ` — Asiento ${selectedSeats[i]}` : ''}
                  </Text>
                )}
                <Form.Item name={['passengers', i, 'name']} label={t('passengerName')} rules={[{ required: true }]} style={{ marginBottom: 8 }}>
                  <Input size="large" />
                </Form.Item>
                <Form.Item name={['passengers', i, 'phone']} label={t('passengerPhone')} rules={[{ required: true }]} style={{ marginBottom: 8 }}>
                  <Input size="large" placeholder="+591 70000000" />
                </Form.Item>
              </div>
            ))}

            {hasPaymentMethods && (
              <Form.Item name="paymentMethod" label={t('paymentMethod')} rules={[{ required: true }]}>
                <Radio.Group style={{ width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {hasBankTransfer && (
                      <Radio value="bank_transfer" style={{ padding: '10px 16px', border: `1px solid ${colors.border}`, borderRadius: 8, width: '100%' }}>
                        <BankOutlined style={{ color: colors.secondary, marginRight: 8 }} />{t('bankTransfer')}
                      </Radio>
                    )}
                    {hasQr && (
                      <Radio value="qr" style={{ padding: '10px 16px', border: `1px solid ${colors.border}`, borderRadius: 8, width: '100%' }}>
                        <QrcodeOutlined style={{ color: colors.primary, marginRight: 8 }} />{t('qr')}
                      </Radio>
                    )}
                  </div>
                </Radio.Group>
              </Form.Item>
            )}
            <Button type="primary" htmlType="submit" block size="large"
              disabled={!hasPaymentMethods}
              style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
              {t('next')}
            </Button>
          </Form>
        </Card>
      )}

      {step === 1 && step1Values && (
        <Card style={{ borderRadius: 10 }}>
          {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}

          {step1Values.paymentMethod === 'bank_transfer' && (
            <div style={{ marginBottom: 20 }}>
              <Title level={5}><BankOutlined /> {t('bankInstructions')}</Title>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div><Text type="secondary">Banco: </Text><Text strong>{schedule.payment.bankName}</Text></div>
                <div><Text type="secondary">Cuenta: </Text><Text strong copyable>{schedule.payment.bankAccount!}</Text></div>
                <div><Text type="secondary">Titular: </Text><Text strong>{schedule.payment.bankAccountHolder}</Text></div>
                <Divider style={{ margin: '4px 0' }} />
                <div><Text type="secondary">Monto a depositar: </Text>
                  <Text strong style={{ color: colors.primary, fontSize: 18 }}>
                    Bs. {totalAmount.toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
          )}

          {step1Values.paymentMethod === 'qr' && (
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              <Title level={5}><QrcodeOutlined /> {t('qrInstructions')}</Title>
              <Image src={schedule.payment.qrImageUrl!} alt="QR de pago" width={200} style={{ borderRadius: 8 }} />
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ color: colors.primary, fontSize: 18 }}>
                  Bs. {totalAmount.toFixed(2)}
                </Text>
              </div>
            </div>
          )}

          <Divider />

          <Title level={5} style={{ marginBottom: 4 }}>{t('proofTitle')}</Title>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
            {t('proofOptional')}
          </Text>

          {!proofUrl ? (
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={async (file) => {
                setUploading(true);
                setError(null);
                try {
                  const url = await uploadImage(file as RcFile);
                  setProofUrl(url);
                } catch {
                  setError('Error al subir la imagen. Intenta de nuevo.');
                } finally {
                  setUploading(false);
                }
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} loading={uploading} block size="large"
                style={{ borderStyle: 'dashed', borderColor: colors.primary, color: colors.primary }}>
                {uploading ? 'Subiendo imagen...' : 'Subir foto del comprobante'}
              </Button>
            </Upload>
          ) : (
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <CheckCircleOutlined style={{ color: colors.success, fontSize: 24, marginBottom: 8, display: 'block' }} />
              <Text style={{ color: colors.success }}>Comprobante subido</Text>
              <div style={{ marginTop: 8 }}>
                <Image src={proofUrl} alt="Comprobante" width={200} style={{ borderRadius: 8 }} />
              </div>
              <Button type="link" size="small" onClick={() => setProofUrl(null)} style={{ color: colors.textSecondary }}>
                Cambiar imagen
              </Button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <Button type="primary" block size="large" loading={loading}
              onClick={handleStep2Submit}
              style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
              {proofUrl ? t('confirm') : t('confirmWithoutProof')}
            </Button>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => { setStep(0); setError(null); setProofUrl(null); }}>
              {t('back')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
