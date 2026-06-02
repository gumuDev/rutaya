'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button, Typography, Spin, Empty, Grid } from 'antd';
import { ArrowRightOutlined, LeftOutlined, RightOutlined, FilterOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from '@/shared/lib/dayjs';
import { searchSchedules } from '../services/reservations.service';
import { ScheduleResult } from '../types/reservation.types';
import { colors } from '@/shared/theme/colors';
import { FiltersSidebar, Filters, getTimeSlot, vehicleLabels } from './FiltersSidebar';
import { ModifySearchPanel } from './ModifySearchPanel';

const { Text } = Typography;
const { useBreakpoint } = Grid;

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: `1px solid ${colors.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', maxWidth: 1280, margin: '0 auto', height: 80 }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: colors.primary, letterSpacing: -0.5 }}>RutaYa</span>
        </a>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <a href="/" style={{ color: colors.primary, fontSize: 15, fontWeight: 700, textDecoration: 'none', borderBottom: `2px solid ${colors.accent}`, paddingBottom: 2 }}>Buscar</a>
            <a href="/login" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Para Empresas</a>
            <a href="/recover" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>Mis Viajes</a>
          </div>
        )}
        <a href="/login" style={{ background: colors.accent, color: colors.navy, fontSize: 14, fontWeight: 700, padding: '10px 20px', borderRadius: 8, textDecoration: 'none' }}>
          {isMobile ? 'Ingresar' : 'Iniciar Sesión/Registrarse'}
        </a>
      </nav>
    </header>
  );
}

// ─── Schedule Card ────────────────────────────────────────────────────────────

function ScheduleCard({ s, origin, destination, date, onBook }: {
  s: ScheduleResult; origin: string; destination: string; date: string; onBook: () => void;
}) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const formattedDate = date ? dayjs(date + 'T12:00:00').format('ddd DD MMM') : '';
  const isLowAvailability = s.available <= 5;

  const cardStyle: React.CSSProperties = {
    background: colors.bgCard, borderRadius: 12,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden',
  };

  if (isMobile) {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: colors.primary }}>{s.companyName}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{vehicleLabels[s.vehicleType] ?? s.vehicleType}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Por Persona</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: colors.primary, lineHeight: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. </span>{Number(s.price).toFixed(0)}
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Sale · {formattedDate}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary }}>{s.departureTime}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>{origin}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 28, height: 1, background: colors.border }} />
            <span style={{ fontSize: 18 }}>🚌</span>
            <div style={{ width: 28, height: 1, background: colors.border }} />
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Llega</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary }}>—</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>{destination}</div>
          </div>
        </div>
        <div style={{ padding: '10px 16px', background: colors.bgSection, borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: isLowAvailability ? colors.error : colors.success, fontWeight: 600 }}>
            {isLowAvailability ? `¡Solo quedan ${s.available}!` : `${s.available} asientos disp.`}
          </div>
          <Button size="middle" onClick={onBook} style={{ background: colors.accent, borderColor: colors.accent, color: colors.navy, fontWeight: 700, borderRadius: 8 }}>
            Seleccionar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 140, borderRight: `1px solid ${colors.border}` }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,56,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: colors.primary, marginBottom: 8 }}>
            {s.companyName.charAt(0)}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, textAlign: 'center', lineHeight: 1.2 }}>{s.companyName}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>{vehicleLabels[s.vehicleType] ?? s.vehicleType}</div>
        </div>

        <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
          <div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>{formattedDate}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, lineHeight: 1 }}>{s.departureTime}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>📍 {origin}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Directo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
              <div style={{ flex: 1, height: 1, background: colors.border }} />
              <span style={{ fontSize: 18 }}>🚌</span>
              <div style={{ flex: 1, height: 1, background: colors.border }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Llega</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, lineHeight: 1 }}>—</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>📍 {destination}</div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 110, borderLeft: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: isLowAvailability ? colors.error : colors.success }}>
            {isLowAvailability ? `¡Solo quedan ${s.available} asientos!` : `${s.available} asientos disp.`}
          </span>
        </div>

        <div style={{ background: colors.bgSection, borderLeft: `1px solid ${colors.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 160, gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Por Persona</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: colors.primary, lineHeight: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Bs. </span>{Number(s.price).toFixed(0)}
            </div>
          </div>
          <Button block onClick={onBook} style={{ background: colors.accent, borderColor: colors.accent, color: colors.navy, fontWeight: 700, borderRadius: 8, height: 40, fontSize: 12 }}>
            SELECCIONAR ASIENTOS
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ScheduleResults() {
  const t = useTranslations('search');
  const router = useRouter();
  const params = useSearchParams();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const origin      = params.get('origin') ?? '';
  const destination = params.get('destination') ?? '';
  const date        = params.get('date') ?? '';
  const passengers  = params.get('passengers') ?? '1';

  const [results, setResults]               = useState<ScheduleResult[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedDate, setSelectedDate]     = useState<dayjs.Dayjs | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showModify, setShowModify]         = useState(false);
  const [filters, setFilters]               = useState<Filters>({ priceRange: [0, 9999], companies: [], vehicleTypes: [], timeSlots: [] });

  useEffect(() => { if (date) setSelectedDate(dayjs(date)); }, [date]);

  useEffect(() => {
    if (!origin || !destination || !date) return;
    setLoading(true);
    setShowModify(false);
    searchSchedules(origin, destination, date, Number(passengers))
      .then((data) => {
        setResults(data);
        if (data.length > 0) {
          const prices = data.map(r => Number(r.price));
          setFilters(f => ({ ...f, priceRange: [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] }));
        }
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [origin, destination, date]);

  const filtered = useMemo(() => results.filter(r => {
    const price = Number(r.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    if (filters.companies.length > 0 && !filters.companies.includes(r.companyName)) return false;
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes(r.vehicleType)) return false;
    if (filters.timeSlots.length > 0 && !filters.timeSlots.includes(getTimeSlot(r.departureTime))) return false;
    return true;
  }), [results, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.companies.length > 0) count++;
    if (filters.vehicleTypes.length > 0) count++;
    if (filters.timeSlots.length > 0) count++;
    if (results.length > 0) {
      const prices = results.map(r => Number(r.price));
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      if (filters.priceRange[0] > min || filters.priceRange[1] < max) count++;
    }
    return count;
  }, [filters, results]);

  function clearFilters() {
    const prices = results.map(r => Number(r.price));
    setFilters({
      priceRange: results.length > 0 ? [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] : [0, 9999],
      companies: [], vehicleTypes: [], timeSlots: [],
    });
  }

  function navigateDate(d: dayjs.Dayjs) {
    router.push(`/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${d.format('YYYY-MM-DD')}&passengers=${passengers}`);
  }

  const days = selectedDate
    ? Array.from({ length: 9 }, (_, i) => selectedDate.subtract(2, 'day').add(i, 'day'))
    : [];

  const filtersProps = {
    results, filters,
    onChange: (f: Partial<Filters>) => setFilters(prev => ({ ...prev, ...f })),
    onClear: clearFilters,
    activeCount: activeFilterCount,
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar />

      {showModify && (
        <ModifySearchPanel
          defaultOrigin={origin} defaultDestination={destination}
          defaultDate={date} defaultPassengers={passengers}
          onClose={() => setShowModify(false)}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.textSecondary, fontSize: 14, marginBottom: 6, flexWrap: 'wrap' }}>
          <span>{origin}</span>
          <ArrowRightOutlined style={{ fontSize: 12 }} />
          <span>{destination}</span>
          <span style={{ color: colors.borderStrong }}>•</span>
          <span>{selectedDate ? selectedDate.format('dddd, D MMM') : date}</span>
          <span style={{ color: colors.borderStrong }}>•</span>
          <span>{passengers} pasajero{Number(passengers) > 1 ? 's' : ''}</span>
          <Button
            size="small" icon={<EditOutlined />}
            onClick={() => setShowModify(v => !v)}
            style={{
              marginLeft: 4,
              borderColor: showModify ? colors.primary : colors.border,
              background: showModify ? `rgba(0,56,112,0.06)` : 'transparent',
              color: colors.primary, fontWeight: 600,
            }}
          >
            Modificar
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.primary, margin: '0 0 16px', letterSpacing: -0.3 }}>
            Viajes Disponibles
          </h1>
          {isMobile && (
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowMobileFilters(true)}
              style={{ borderColor: activeFilterCount > 0 ? colors.primary : colors.border, color: activeFilterCount > 0 ? colors.primary : colors.textSecondary, fontWeight: 600 }}
            >
              Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* Date strip */}
      <div style={{ background: colors.bgCard, borderBottom: `1px solid ${colors.border}`, borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 16px', overflowX: 'auto' }}>
          <Button type="text" icon={<LeftOutlined />} size="small" onClick={() => selectedDate && navigateDate(selectedDate.subtract(1, 'day'))} />
          {days.map((d) => {
            const isSelected = d.format('YYYY-MM-DD') === date;
            return (
              <button key={d.format('YYYY-MM-DD')} onClick={() => navigateDate(d)} style={{
                padding: '10px 12px', border: 'none',
                borderBottom: isSelected ? `3px solid ${colors.primary}` : '3px solid transparent',
                background: 'none', cursor: 'pointer', textAlign: 'center', minWidth: 52, flexShrink: 0,
              }}>
                <div style={{ fontSize: 17, fontWeight: isSelected ? 800 : 400, color: isSelected ? colors.primary : colors.textPrimary }}>{d.format('D')}</div>
                <div style={{ fontSize: 10, color: isSelected ? colors.primary : colors.textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>{d.format('MMM')}</div>
              </button>
            );
          })}
          <Button type="text" icon={<RightOutlined />} size="small" onClick={() => selectedDate && navigateDate(selectedDate.add(1, 'day'))} />
        </div>
      </div>

      {/* Content grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: 24, alignItems: 'start' }}>

          {!isMobile && <FiltersSidebar {...filtersProps} />}

          {isMobile && showMobileFilters && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowMobileFilters(false)} />
              <div style={{ position: 'relative', marginLeft: 'auto', width: 300, height: '100%', overflowY: 'auto', background: '#fff', padding: 16, boxShadow: '-4px 0 20px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: colors.primary }}>Filtros</span>
                  <Button type="text" icon={<CloseOutlined />} onClick={() => setShowMobileFilters(false)} />
                </div>
                <FiltersSidebar {...filtersProps} />
                <Button block type="primary" onClick={() => setShowMobileFilters(false)} style={{ marginTop: 12, background: colors.primary, borderColor: colors.primary, fontWeight: 700 }}>
                  Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          )}

          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <Spin size="large" />
              </div>
            ) : results.length === 0 ? (
              <Empty description={t('noResults')} style={{ padding: 80, background: colors.bgCard, borderRadius: 12 }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {filtered.length} de {results.length} viaje{results.length > 1 ? 's' : ''} disponible{results.length > 1 ? 's' : ''}
                  </Text>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: colors.error, fontWeight: 600 }}>
                      Limpiar filtros
                    </button>
                  )}
                </div>

                {filtered.length === 0 ? (
                  <div style={{ padding: 48, background: colors.bgCard, borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                    <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
                      Ningún viaje coincide con los filtros seleccionados.
                    </Text>
                    <div style={{ marginTop: 12 }}>
                      <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.primary, fontWeight: 700, fontSize: 14 }}>
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                ) : (
                  filtered.map((s) => (
                    <ScheduleCard
                      key={s.id} s={s} origin={origin} destination={destination} date={date}
                      onBook={() => router.push(`/book/${s.id}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=${passengers}`)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
