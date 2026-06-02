'use client';

import { useMemo } from 'react';
import { Slider, Grid } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ScheduleResult } from '../types/reservation.types';
import { colors } from '@/shared/theme/colors';

const { useBreakpoint } = Grid;

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export const TIME_SLOTS: { key: TimeSlot; label: string; icon: string; range: [number, number] }[] = [
  { key: 'morning',   label: 'MAÑANA',    icon: '🌅', range: [5,  11] },
  { key: 'afternoon', label: 'TARDE',     icon: '☀️', range: [12, 17] },
  { key: 'evening',   label: 'ATARDECER', icon: '🌆', range: [18, 20] },
  { key: 'night',     label: 'NOCHE',     icon: '🌙', range: [21,  4] },
];

export const vehicleLabels: Record<string, string> = {
  trufi: 'Trufi',
  minibus: 'Minibus',
  bus: 'Bus',
};

export function getTimeSlot(time: string): TimeSlot {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour >= 5  && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 17) return 'afternoon';
  if (hour >= 18 && hour <= 20) return 'evening';
  return 'night';
}

export interface Filters {
  priceRange: [number, number];
  companies: string[];
  vehicleTypes: string[];
  timeSlots: TimeSlot[];
}

export function FiltersSidebar({
  results, filters, onChange, onClear, activeCount,
}: {
  results: ScheduleResult[];
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onClear: () => void;
  activeCount: number;
}) {
  const companies = useMemo(() => [...new Set(results.map(r => r.companyName))].sort(), [results]);
  const vehicles  = useMemo(() => [...new Set(results.map(r => r.vehicleType))], [results]);
  const prices    = useMemo(() => results.map(r => Number(r.price)), [results]);
  const priceMin  = useMemo(() => Math.floor(Math.min(...prices, 0)), [prices]);
  const priceMax  = useMemo(() => Math.ceil(Math.max(...prices, 500)), [prices]);

  function toggleCompany(c: string) {
    onChange({ companies: filters.companies.includes(c) ? filters.companies.filter(x => x !== c) : [...filters.companies, c] });
  }
  function toggleVehicle(v: string) {
    onChange({ vehicleTypes: filters.vehicleTypes.includes(v) ? filters.vehicleTypes.filter(x => x !== v) : [...filters.vehicleTypes, v] });
  }
  function toggleTimeSlot(t: TimeSlot) {
    onChange({ timeSlots: filters.timeSlots.includes(t) ? filters.timeSlots.filter(x => x !== t) : [...filters.timeSlots, t] });
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' };
  const sectionStyle: React.CSSProperties = { marginBottom: 24 };

  return (
    <aside style={{ background: colors.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: 96 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, margin: 0 }}>Filtros</h2>
        {activeCount > 0 && (
          <button onClick={onClear} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: colors.error, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CloseOutlined style={{ fontSize: 10 }} /> Limpiar ({activeCount})
          </button>
        )}
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Rango de Precios (Bs)</label>
        <Slider
          range min={priceMin} max={priceMax}
          value={filters.priceRange}
          onChange={(v) => onChange({ priceRange: v as [number, number] })}
          styles={{ track: { background: colors.primary }, handle: { borderColor: colors.primary } }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: colors.borderStrong, marginTop: 2 }}>
          <span>Bs {filters.priceRange[0]}</span>
          <span>Bs {filters.priceRange[1]}</span>
        </div>
      </div>

      {companies.length > 0 && (
        <div style={sectionStyle}>
          <label style={labelStyle}>Operador</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {companies.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.companies.includes(c)} onChange={() => toggleCompany(c)}
                  style={{ accentColor: colors.primary, width: 15, height: 15, cursor: 'pointer' }} />
                <span style={{ fontSize: 14, color: colors.textPrimary }}>{c}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {vehicles.length > 0 && (
        <div style={sectionStyle}>
          <label style={labelStyle}>Tipo de Vehículo</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {vehicles.map(v => {
              const active = filters.vehicleTypes.includes(v);
              return (
                <button key={v} onClick={() => toggleVehicle(v)} style={{
                  padding: '5px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1px solid ${active ? colors.primary : colors.border}`,
                  background: active ? colors.primary : 'none',
                  color: active ? '#fff' : colors.textSecondary,
                  transition: 'all 0.15s',
                }}>
                  {vehicleLabels[v] ?? v}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={sectionStyle}>
        <label style={labelStyle}>Horario de Salida</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {TIME_SLOTS.map(slot => {
            const active = filters.timeSlots.includes(slot.key);
            const hasResults = results.some(r => getTimeSlot(r.departureTime) === slot.key);
            return (
              <button key={slot.key} onClick={() => hasResults && toggleTimeSlot(slot.key)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', borderRadius: 8,
                cursor: hasResults ? 'pointer' : 'not-allowed',
                border: `1px solid ${active ? colors.primary : colors.border}`,
                background: active ? `rgba(0,56,112,0.07)` : 'none',
                opacity: hasResults ? 1 : 0.35,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 18 }}>{slot.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: active ? colors.primary : colors.textSecondary, marginTop: 4 }}>{slot.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
