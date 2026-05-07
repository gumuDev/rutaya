'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Steps, Card, Typography, Alert, Radio, DatePicker, Spin, Empty, Tag, Divider } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, CheckCircleOutlined, UserOutlined, DollarOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from '@/shared/lib/dayjs';
import { ScheduleResult, SeatsResponse } from '@/features/reservations/types/reservation.types';
import { searchSchedulesPos, createPosReservation, PosPayload } from '../services/pos.service';
import { getSeats } from '@/features/reservations/services/reservations.service';
import { SeatMap } from '@/features/reservations/components/SeatMap';
import { useCities } from '@/features/reservations/hooks/useCities';
import { AutoComplete } from 'antd';
import { colors } from '@/shared/theme/colors';


const { Title, Text } = Typography;

interface PassengerEntry { name: string; phone: string; }

export function PosForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0 — search
  const [originQ, setOriginQ] = useState('');
  const [destinationQ, setDestinationQ] = useState('');
  const { options: originOptions } = useCities(originQ);
  const { options: destinationOptions } = useCities(destinationQ);
  const [searchForm] = Form.useForm();
  const [searching, setSearching] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [travelDate, setTravelDate] = useState('');

  // Step 1 — select schedule + passengers + seats
  const [selected, setSelected] = useState<ScheduleResult | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [passengers, setPassengers] = useState<PassengerEntry[]>([{ name: '', phone: '' }]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [seatsData, setSeatsData] = useState<SeatsResponse | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // Step 2 — confirm
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (selected?.vehicleType === 'bus') {
      getSeats(selected.id, travelDate).then(setSeatsData).catch(() => {});
    } else {
      setSeatsData(null);
      setSelectedSeats([]);
    }
  }, [selected, travelDate]);

  useEffect(() => {
    const count = selected?.vehicleType === 'bus' ? selectedSeats.length || 1 : quantity;
    setPassengers(Array.from({ length: count }, (_, i) => passengers[i] ?? { name: '', phone: '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, selectedSeats.length, selected]);

  async function handleSearch(values: { origin: string; destination: string; date: dayjs.Dayjs; quantity: number }) {
    setSearching(true);
    setSearchError(null);
    const date = values.date.format('YYYY-MM-DD');
    setTravelDate(date);
    setQuantity(values.quantity ?? 1);
    try {
      const results = await searchSchedulesPos(values.origin, values.destination, date);
      setSchedules(results);
      if (results.length === 0) setSearchError('No hay horarios disponibles para esta búsqueda.');
      else setStep(1);
    } catch {
      setSearchError('Error al buscar horarios.');
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirm() {
    const isBus = selected?.vehicleType === 'bus';
    const qty = isBus ? selectedSeats.length : quantity;

    const missingPassenger = passengers.slice(0, qty).find((p) => !p.name || !p.phone);
    if (missingPassenger) { setSaveError('Completa nombre y teléfono de todos los pasajeros.'); return; }

    setSaving(true);
    setSaveError(null);
    try {
      const results = await Promise.all(
        passengers.slice(0, qty).map((p, idx) => {
          const payload: PosPayload = {
            scheduleId: selected!.id,
            passengerName: p.name,
            passengerPhone: p.phone,
            quantity: 1,
            paymentMethod,
            travelDate,
            selectedSeats: isBus ? [selectedSeats[idx]] : undefined,
          };
          return createPosReservation(payload);
        })
      );
      const codes = results.map((r) => r.reservation.code);
      router.push(codes.length === 1 ? `/ticket/${codes[0]}` : `/tickets?codes=${codes.join(',')}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'request_failed';
      const map: Record<string, string> = {
        insufficient_capacity: 'No hay suficiente capacidad disponible.',
        schedule_not_found: 'El horario no está disponible.',
        request_failed: 'Error al crear la reserva.',
      };
      setSaveError(map[msg] ?? map.request_failed);
    } finally {
      setSaving(false);
    }
  }

  const isBus = selected?.vehicleType === 'bus';
  const effectiveQty = isBus ? (selectedSeats.length || 1) : quantity;
  const total = selected ? Number(selected.price) * effectiveQty : 0;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <Steps current={step} size="small" style={{ marginBottom: 24 }}
        items={[{ title: 'Buscar horario' }, { title: 'Pasajeros y pago' }, { title: 'Confirmar' }]}
      />

      {/* STEP 0 — Búsqueda */}
      {step === 0 && (
        <Card style={{ borderRadius: 10 }}>
          <Title level={5} style={{ marginBottom: 16, color: colors.secondary }}>
            <SearchOutlined style={{ marginRight: 8 }} />Buscar horario
          </Title>
          <Form form={searchForm} layout="vertical" onFinish={handleSearch} requiredMark={false}
            initialValues={{ quantity: 1 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Form.Item name="origin" label="Origen" rules={[{ required: true }]} style={{ flex: '1 1 180px', marginBottom: 12 }}>
                <AutoComplete options={originOptions} onSearch={setOriginQ} filterOption={false} size="large" placeholder="Ciudad de origen" />
              </Form.Item>
              <Form.Item name="destination" label="Destino" rules={[{ required: true }]} style={{ flex: '1 1 180px', marginBottom: 12 }}>
                <AutoComplete options={destinationOptions} onSearch={setDestinationQ} filterOption={false} size="large" placeholder="Ciudad de destino" />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Form.Item name="date" label="Fecha de viaje" rules={[{ required: true }]} style={{ flex: '1 1 180px', marginBottom: 12 }}>
                <DatePicker size="large" style={{ width: '100%' }} format="D MMM YYYY"
                  disabledDate={(d) => d.isBefore(dayjs(), 'day')} />
              </Form.Item>
              <Form.Item name="quantity" label="Pasajeros" style={{ flex: '0 1 120px', marginBottom: 12 }}>
                <InputNumber min={1} max={20} size="large" style={{ width: '100%' }} />
              </Form.Item>
            </div>
            {searchError && <Alert title={searchError} type="warning" showIcon style={{ marginBottom: 12 }} />}
            <Button type="primary" htmlType="submit" size="large" loading={searching} icon={<SearchOutlined />}
              style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
              Buscar
            </Button>
          </Form>
        </Card>
      )}

      {/* STEP 1 — Seleccionar horario + datos */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Lista de horarios */}
          {!selected ? (
            <>
              <Text type="secondary" style={{ fontSize: 13 }}>{schedules.length} horario{schedules.length !== 1 ? 's' : ''} disponible{schedules.length !== 1 ? 's' : ''}</Text>
              {schedules.length === 0 ? <Empty description="Sin resultados" /> : schedules.map((s) => (
                <Card key={s.id} hoverable style={{ borderRadius: 10, cursor: 'pointer' }} onClick={() => setSelected(s)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <Text strong>{s.origin} → {s.destination}</Text>
                      <div style={{ marginTop: 4 }}>
                        <Tag color="blue">{s.departureTime}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>{s.companyName} · {s.vehicleType}</Text>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: 18, color: colors.primary }}>Bs. {Number(s.price).toFixed(0)}</Text>
                      <div><Text type="secondary" style={{ fontSize: 12 }}>{s.available} disp.</Text></div>
                    </div>
                  </div>
                </Card>
              ))}
              <Button icon={<ArrowLeftOutlined />} onClick={() => setStep(0)}>Volver</Button>
            </>
          ) : (
            <Card style={{ borderRadius: 10 }}>
              {/* Resumen horario seleccionado */}
              <div style={{ background: colors.accent, borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <Text strong>{selected.origin} → {selected.destination}</Text>
                <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{selected.departureTime} · {selected.companyName}</Text>
                  <Text strong style={{ color: colors.primary }}>Bs. {(total).toFixed(2)}</Text>
                </div>
              </div>

              {/* Mapa de asientos o cantidad */}
              {isBus && seatsData ? (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Selecciona los asientos</Text>
                  <SeatMap
                    capacity={seatsData.capacity}
                    serviceType={seatsData.serviceType as 'normal' | 'semicama' | 'cama' | 'leito'}
                    takenSeats={seatsData.takenSeats}
                    selectedSeats={selectedSeats}
                    onToggle={(s) => setSelectedSeats((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                    maxSelect={selected.available}
                  />
                </div>
              ) : !isBus ? (
                <Form.Item label="Cantidad de pasajeros" style={{ marginBottom: 16 }}>
                  <InputNumber min={1} max={selected.available} value={quantity}
                    onChange={(v) => setQuantity(v ?? 1)} size="large" style={{ width: 120 }} />
                </Form.Item>
              ) : null}

              <Divider style={{ margin: '12px 0' }} />

              {/* Datos de pasajeros */}
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                <UserOutlined style={{ marginRight: 6 }} />
                Datos de {effectiveQty} pasajero{effectiveQty > 1 ? 's' : ''}
              </Text>
              {Array.from({ length: effectiveQty }, (_, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px 2px', marginBottom: 10, border: `1px solid ${colors.border}` }}>
                  {effectiveQty > 1 && (
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                      Pasajero {i + 1}{isBus && selectedSeats[i] ? ` — Asiento ${selectedSeats[i]}` : ''}
                    </Text>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Input size="large" placeholder="Nombre completo" style={{ flex: '1 1 160px' }}
                      value={passengers[i]?.name ?? ''}
                      onChange={(e) => setPassengers((prev) => prev.map((p, idx) => idx === i ? { ...p, name: e.target.value } : p))} />
                    <Input size="large" placeholder="+591 70000000" style={{ flex: '1 1 140px' }}
                      value={passengers[i]?.phone ?? ''}
                      onChange={(e) => setPassengers((prev) => prev.map((p, idx) => idx === i ? { ...p, phone: e.target.value } : p))} />
                  </div>
                </div>
              ))}

              <Divider style={{ margin: '12px 0' }} />

              {/* Método de pago */}
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Método de pago</Text>
              <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Radio.Button value="cash" style={{ flex: 1, textAlign: 'center', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarOutlined style={{ marginRight: 6 }} />Efectivo
                  </Radio.Button>
                  {selected.payment.qrImageUrl && (
                    <Radio.Button value="qr" style={{ flex: 1, textAlign: 'center', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrcodeOutlined style={{ marginRight: 6 }} />QR
                    </Radio.Button>
                  )}
                </div>
              </Radio.Group>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => setSelected(null)}>Volver</Button>
                <Button type="primary" block size="large"
                  disabled={isBus && selectedSeats.length === 0}
                  onClick={() => { setSaveError(null); setStep(2); }}
                  style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
                  Continuar
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* STEP 2 — Confirmar */}
      {step === 2 && selected && (
        <Card style={{ borderRadius: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <CheckCircleOutlined style={{ fontSize: 40, color: colors.success, display: 'block', marginBottom: 8 }} />
            <Title level={4} style={{ margin: 0 }}>Confirmar venta</Title>
          </div>

          <div style={{ background: colors.accent, borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Ruta</Text>
              <Text strong>{selected.origin} → {selected.destination}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Salida</Text>
              <Text strong>{selected.departureTime} · {dayjs(travelDate).format('DD/MM/YYYY')}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Pasajeros</Text>
              <Text strong>{effectiveQty}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Pago</Text>
              <Tag color={paymentMethod === 'cash' ? 'green' : 'blue'}>
                {paymentMethod === 'cash' ? '💵 Efectivo' : '📱 QR'}
              </Tag>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Total</Text>
              <Text strong style={{ fontSize: 20, color: colors.primary }}>Bs. {total.toFixed(2)}</Text>
            </div>
          </div>

          {saveError && <Alert title={saveError} type="error" showIcon style={{ marginBottom: 16 }} />}

          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => setStep(1)}>Volver</Button>
            <Button type="primary" block size="large" loading={saving} onClick={handleConfirm}
              style={{ background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
              Confirmar y emitir ticket{effectiveQty > 1 ? 's' : ''}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
