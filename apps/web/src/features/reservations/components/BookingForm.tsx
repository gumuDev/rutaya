'use client';

import { Form, Input, InputNumber, Button, Alert, Typography, Steps, Radio, Image, Upload, Divider, Grid } from 'antd';
import {
  BankOutlined, QrcodeOutlined, ArrowRightOutlined, UploadOutlined,
  CheckCircleOutlined, UserOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
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
const { useBreakpoint } = Grid;

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

// ─── Shared Navbar ────────────────────────────────────────────────────────────

function Navbar() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#ffffff',
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', maxWidth: 1280, margin: '0 auto', height: 80,
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: colors.primary, letterSpacing: -0.5 }}>
            RutaYa
          </span>
        </a>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <a href="/" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Buscar</a>
            <a href="/login" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Para Empresas</a>
            <a href="/recover" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Mis Viajes</a>
          </div>
        )}
        <a href="/login" style={{
          background: colors.accent, color: colors.navy,
          fontSize: 14, fontWeight: 700, padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
        }}>
          {isMobile ? 'Ingresar' : 'Iniciar Sesión/Registrarse'}
        </a>
      </nav>
    </header>
  );
}

// ─── Route Summary Bar ────────────────────────────────────────────────────────

function RouteSummary({ schedule, effectiveQuantity, totalAmount }: {
  schedule: ScheduleResult;
  effectiveQuantity: number;
  totalAmount: number;
}) {
  return (
    <div style={{
      background: colors.bgCard, borderRadius: 12, border: `1px solid ${colors.border}`,
      padding: '16px 20px', marginBottom: 24,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          {schedule.origin}
          <ArrowRightOutlined style={{ fontSize: 14, color: colors.primary }} />
          {schedule.destination}
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
          {schedule.departureTime} · {schedule.companyName} · {effectiveQuantity} pasajero{effectiveQuantity > 1 ? 's' : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>Precio Total</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: colors.primary, lineHeight: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Bs. </span>
          {totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: colors.bgCard, borderRadius: 12, border: `1px solid ${colors.border}`,
      padding: '20px 24px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        {icon && <span style={{ color: colors.primary, fontSize: 18 }}>{icon}</span>}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 60px' }}>

        {/* Stepper */}
        <Steps
          current={step}
          style={{ marginBottom: 28 }}
          items={[
            { title: t('step1') },
            { title: t('step2') },
          ]}
        />

        {/* Route summary */}
        <RouteSummary schedule={schedule} effectiveQuantity={effectiveQuantity} totalAmount={totalAmount} />

        {/* Step 0 — Datos del pasajero */}
        {step === 0 && (
          <Form
            layout="vertical"
            onFinish={(values: { passengers: PassengerEntry[]; quantity: number; paymentMethod: PaymentMethod }) => {
              if (isBus && selectedSeats.length === 0) return;
              const effectiveQty = isBus ? selectedSeats.length : (values.quantity ?? 1);
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
            {!hasPaymentMethods && (
              <Alert title={t('noPaymentConfigured')} type="warning" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
            )}

            {/* Seat selection for bus */}
            {isBus && seatsData && (
              <SectionCard title="Selecciona tus asientos">
                <SeatMap
                  capacity={seatsData.capacity}
                  serviceType={seatsData.serviceType as 'normal' | 'semicama' | 'cama' | 'leito'}
                  takenSeats={seatsData.takenSeats}
                  selectedSeats={selectedSeats}
                  onToggle={toggleSeat}
                  maxSelect={20}
                />
                {selectedSeats.length === 0 && (
                  <div style={{ color: colors.error, fontSize: 12, marginTop: 8 }}>Selecciona al menos un asiento</div>
                )}
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: colors.textSecondary }}>
                  {selectedSeats.length} de {seatsData.capacity} asientos seleccionados
                </div>
              </SectionCard>
            )}

            {/* Quantity for non-bus */}
            {!isBus && (
              <SectionCard title={t('quantity')} icon={<UserOutlined />}>
                <Form.Item name="quantity" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                  <InputNumber min={1} max={schedule.available} size="large" style={{ width: '100%' }}
                    onChange={(v) => setQuantity(v ?? 1)} />
                </Form.Item>
              </SectionCard>
            )}

            {/* Passenger data */}
            <SectionCard title="Datos del pasajero" icon={<UserOutlined />}>
              {Array.from({ length: isBus ? (selectedSeats.length || initialPassengers) : quantity }, (_, i) => (
                <div key={i} style={{
                  background: colors.bg, borderRadius: 8, padding: '14px 16px 6px',
                  marginBottom: 12, border: `1px solid ${colors.border}`,
                }}>
                  {(isBus ? selectedSeats.length || initialPassengers : quantity) > 1 && (
                    <Text style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 10, fontWeight: 600 }}>
                      Pasajero {i + 1}{isBus && selectedSeats[i] ? ` — Asiento ${selectedSeats[i]}` : ''}
                    </Text>
                  )}
                  <Form.Item name={['passengers', i, 'name']} label={t('passengerName')} rules={[{ required: true }]} style={{ marginBottom: 10 }}>
                    <Input size="large" placeholder="Ej. Juan Pérez" />
                  </Form.Item>
                  <Form.Item name={['passengers', i, 'phone']} label={t('passengerPhone')} rules={[{ required: true }]} style={{ marginBottom: 8 }}>
                    <Input size="large" placeholder="+591 70000000" />
                  </Form.Item>
                </div>
              ))}
            </SectionCard>

            {/* Payment method */}
            {hasPaymentMethods && (
              <SectionCard title="MÉTODO DE PAGO">
                <Form.Item name="paymentMethod" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                  <Radio.Group style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {hasBankTransfer && (
                        <Radio.Button value="bank_transfer" style={{
                          flex: 1, minWidth: 140, height: 52,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          borderRadius: 8, fontWeight: 600, fontSize: 14,
                        }}>
                          <BankOutlined /> {t('bankTransfer')}
                        </Radio.Button>
                      )}
                      {hasQr && (
                        <Radio.Button value="qr" style={{
                          flex: 1, minWidth: 140, height: 52,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          borderRadius: 8, fontWeight: 600, fontSize: 14,
                        }}>
                          <QrcodeOutlined /> {t('qr')}
                        </Radio.Button>
                      )}
                    </div>
                  </Radio.Group>
                </Form.Item>
              </SectionCard>
            )}

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              disabled={!hasPaymentMethods}
              icon={<ArrowRightOutlined />}
              style={{
                background: colors.primary, borderColor: colors.primary,
                fontWeight: 700, height: 52, borderRadius: 8, fontSize: 16,
              }}
            >
              {t('next')}
            </Button>
          </Form>
        )}

        {/* Step 1 — Instrucciones de pago */}
        {step === 1 && step1Values && (
          <div>
            {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 8 }} />}

            {step1Values.paymentMethod === 'bank_transfer' && (
              <SectionCard title={t('bankInstructions')} icon={<BankOutlined />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Banco', value: schedule.payment.bankName },
                    { label: 'Cuenta', value: schedule.payment.bankAccount, copyable: true },
                    { label: 'Titular', value: schedule.payment.bankAccountHolder },
                  ].map(({ label, value, copyable }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{label}</Text>
                      <Text strong copyable={copyable}>{value}</Text>
                    </div>
                  ))}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Monto a depositar</Text>
                    <Text strong style={{ color: colors.primary, fontSize: 22 }}>Bs. {totalAmount.toFixed(2)}</Text>
                  </div>
                </div>
              </SectionCard>
            )}

            {step1Values.paymentMethod === 'qr' && (
              <SectionCard title={t('qrInstructions')} icon={<QrcodeOutlined />}>
                <div style={{ textAlign: 'center' }}>
                  <Image src={schedule.payment.qrImageUrl!} alt="QR de pago" width={200} style={{ borderRadius: 8 }} />
                  <div style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, display: 'block' }}>
                      Escanea el código QR con la app de tu banco favorito para completar el pago de forma inmediata.
                    </Text>
                    <Text strong style={{ color: colors.primary, fontSize: 22, display: 'block', marginTop: 8 }}>
                      Bs. {totalAmount.toFixed(2)}
                    </Text>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Proof upload */}
            <SectionCard title={t('proofTitle')}>
              <Text style={{ color: colors.textSecondary, fontSize: 13, display: 'block', marginBottom: 16, marginTop: -8 }}>
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
                  <div style={{
                    border: `2px dashed ${colors.border}`, borderRadius: 12, padding: '32px 24px',
                    textAlign: 'center', cursor: 'pointer', background: colors.bg,
                  }}>
                    <UploadOutlined style={{ fontSize: 28, color: colors.primary, display: 'block', marginBottom: 12 }} />
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      {uploading ? 'Subiendo imagen...' : 'Haz clic para seleccionar o arrastra una imagen (JPG, PNG o PDF)'}
                    </Text>
                  </div>
                </Upload>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ color: colors.success, fontSize: 28, marginBottom: 8, display: 'block' }} />
                  <Text style={{ color: colors.success, fontWeight: 600 }}>Comprobante subido correctamente</Text>
                  <div style={{ marginTop: 12 }}>
                    <Image src={proofUrl} alt="Comprobante" width={200} style={{ borderRadius: 8 }} />
                  </div>
                  <Button type="link" size="small" onClick={() => setProofUrl(null)} style={{ color: colors.textSecondary, marginTop: 8 }}>
                    Cambiar imagen
                  </Button>
                </div>
              )}
            </SectionCard>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <Button
                block
                size="large"
                loading={loading}
                onClick={handleStep2Submit}
                style={{
                  background: colors.accent, borderColor: colors.accent, color: colors.navy,
                  fontWeight: 700, height: 52, borderRadius: 8, fontSize: 16,
                }}
              >
                {proofUrl ? t('confirm') : t('confirmWithoutProof')}
              </Button>
              <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textSecondary, display: 'block' }}>
                Al confirmar, nuestro equipo validará tu depósito. Recibirás tu boleto en un lapso de 5 a 15 minutos.
              </Text>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => { setStep(0); setError(null); setProofUrl(null); }}
                style={{ color: colors.textSecondary }}
              >
                {t('back')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
