'use client';

import { useEffect, useState } from 'react';
import { Button, Typography, Spin, Empty } from 'antd';
import { ArrowRightOutlined, LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from '@/shared/lib/dayjs';
import { searchSchedules } from '../services/reservations.service';
import { ScheduleResult } from '../types/reservation.types';
import { colors } from '@/shared/theme/colors';


const { Text } = Typography;

const vehicleLabels: Record<string, string> = { trufi: 'Trufi', minibus: 'Minibus', bus: 'Bus' };

function Divider() {
  return <div style={{ width: 1, background: colors.border, alignSelf: 'stretch', margin: '0 4px' }} />;
}

function ScheduleCard({ s, origin, destination, date, passengers, onBook }: {
  s: ScheduleResult;
  origin: string;
  destination: string;
  date: string;
  passengers: string;
  onBook: () => void;
}) {
  const formattedDate = date
    ? dayjs(date + 'T12:00:00').format('ddd DD MMM')
    : '';

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Empresa */}
      <div style={{ padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 130 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, fontStyle: 'italic', color: colors.secondary, lineHeight: 1.1 }}>
            {s.companyName}
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
            {vehicleLabels[s.vehicleType] ?? s.vehicleType}
          </div>
        </div>
      </div>

      <Divider />

      {/* Salida */}
      <div style={{ padding: '20px 20px', minWidth: 110 }}>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Sale</div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>{formattedDate}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: colors.textPrimary, lineHeight: 1.1 }}>
          {s.departureTime}
        </div>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
          📍 {origin}
        </div>
      </div>

      <Divider />

      {/* Centro — duración + icono */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 100, gap: 6 }}>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>Directo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 1, background: colors.border }} />
          <div style={{ fontSize: 20 }}>🚌</div>
          <div style={{ width: 20, height: 1, background: colors.border }} />
        </div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>
          {vehicleLabels[s.vehicleType]}
        </div>
      </div>

      <Divider />

      {/* Llegada */}
      <div style={{ padding: '20px 20px', minWidth: 110 }}>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Llega</div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>{formattedDate}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: colors.textPrimary, lineHeight: 1.1 }}>
          —
        </div>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
          📍 {destination}
        </div>
      </div>

      <Divider />

      {/* Disponibilidad */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 100, gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.secondary }}>
          {vehicleLabels[s.vehicleType]}
        </div>
        <div style={{ fontSize: 12, color: s.available <= 5 ? colors.error : colors.success }}>
          <UserOutlined /> {s.available} disp.
        </div>
      </div>

      {/* Precio + botón */}
      <div style={{
        background: colors.accent,
        borderLeft: `1px solid #FED7AA`,
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 150,
        gap: 10,
        marginLeft: 'auto',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Desde</div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.secondary }}>Bs. </span>
            <span style={{ fontSize: 30, fontWeight: 900, color: colors.secondary, lineHeight: 1 }}>
              {Number(s.price).toFixed(0)}
            </span>
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>por persona</div>
        </div>
        <Button
          type="primary"
          block
          size="middle"
          style={{
            background: colors.primary,
            borderColor: colors.primary,
            fontWeight: 700,
            borderRadius: 8,
            height: 38,
          }}
          onClick={onBook}
        >
          🎫 Reservar
        </Button>
      </div>
    </div>
  );
}

export function ScheduleResults() {
  const t = useTranslations('search');
  const router = useRouter();
  const params = useSearchParams();
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const origin = params.get('origin') ?? '';
  const destination = params.get('destination') ?? '';
  const date = params.get('date') ?? '';
  const passengers = params.get('passengers') ?? '1';

  useEffect(() => { if (date) setSelectedDate(dayjs(date)); }, [date]);

  useEffect(() => {
    if (!origin || !destination || !date) return;
    setLoading(true);
    searchSchedules(origin, destination, date, Number(passengers))
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [origin, destination, date]);

  function navigateDate(d: dayjs.Dayjs) {
    router.push(`/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${d.format('YYYY-MM-DD')}&passengers=${passengers}`);
  }

  const days = selectedDate
    ? Array.from({ length: 9 }, (_, i) => selectedDate.subtract(2, 'day').add(i, 'day'))
    : [];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>

      {/* Header */}
      <div style={{ background: colors.secondary, padding: '14px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{origin}</span>
            </Text>
            <ArrowRightOutlined style={{ color: colors.primary }} />
            <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{destination}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>· {passengers} pasajero{Number(passengers) > 1 ? 's' : ''}</Text>
          </div>
          <Button size="small" ghost onClick={() => router.push('/')}>
            Modificar
          </Button>
        </div>
      </div>

      {/* Date selector */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 8px', overflowX: 'auto' }}>
          <Button type="text" icon={<LeftOutlined />} onClick={() => selectedDate && navigateDate(selectedDate.subtract(1, 'day'))} />
          {days.map((d) => {
            const isSelected = d.format('YYYY-MM-DD') === date;
            return (
              <button key={d.format('YYYY-MM-DD')} onClick={() => navigateDate(d)} style={{
                padding: '10px 14px', border: 'none',
                borderBottom: isSelected ? `3px solid ${colors.primary}` : '3px solid transparent',
                background: 'none', cursor: 'pointer', textAlign: 'center', minWidth: 60,
              }}>
                <div style={{ fontSize: 18, fontWeight: isSelected ? 800 : 400, color: isSelected ? colors.primary : colors.textPrimary }}>
                  {d.format('D')}
                </div>
                <div style={{ fontSize: 10, color: isSelected ? colors.primary : colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {d.format('MMM')}
                </div>
              </button>
            );
          })}
          <Button type="text" icon={<RightOutlined />} onClick={() => selectedDate && navigateDate(selectedDate.add(1, 'day'))} />
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 16px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
            <Spin size="large" />
          </div>
        ) : results.length === 0 ? (
          <Empty description={t('noResults')} style={{ padding: 64, background: '#fff', borderRadius: 12 }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {results.length} viaje{results.length > 1 ? 's' : ''} disponible{results.length > 1 ? 's' : ''}
            </Text>
            {results.map((s) => (
              <ScheduleCard
                key={s.id}
                s={s}
                origin={origin}
                destination={destination}
                date={date}
                passengers={passengers}
                onBook={() => router.push(`/book/${s.id}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=${passengers}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
