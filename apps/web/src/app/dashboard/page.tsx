'use client';

import { useRouter } from 'next/navigation';
import { Button, Typography, Grid } from 'antd';
import { CarOutlined, PlusOutlined } from '@ant-design/icons';
import { colors } from '@/shared/theme/colors';

const { Text } = Typography;
const { useBreakpoint } = Grid;

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, iconBg, label, value, badge, badgeColor, subtext, inverted,
}: {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  subtext?: string;
  inverted?: boolean;
}) {
  return (
    <div style={{
      background: inverted ? colors.primary : '#fff',
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: 20,
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          background: inverted ? 'rgba(255,255,255,0.15)' : iconBg,
          borderRadius: 8, padding: 8, fontSize: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: badgeColor ?? colors.success,
            background: inverted ? 'rgba(255,255,255,0.15)' : 'transparent',
            padding: inverted ? '2px 8px' : 0, borderRadius: 99,
          }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, color: inverted ? 'rgba(255,255,255,0.75)' : colors.textSecondary, marginBottom: 4, fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: inverted ? '#fff' : colors.primary, lineHeight: 1 }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: 11, color: inverted ? 'rgba(255,255,255,0.6)' : colors.textSecondary, marginTop: 4 }}>
            {subtext}
          </div>
        )}
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: inverted ? 'rgba(255,255,255,0.2)' : colors.bgSection, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: inverted ? colors.accent : colors.primary, width: '75%', borderRadius: 99 }} />
      </div>
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────

const CHART_DATA = [
  { day: 'Lun', pct: 40 },
  { day: 'Mar', pct: 65 },
  { day: 'Mié', pct: 85, active: true },
  { day: 'Jue', pct: 55 },
  { day: 'Vie', pct: 90 },
  { day: 'Sáb', pct: 100, accent: true },
  { day: 'Dom', pct: 70 },
];

function RevenueChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20, height: 320, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: colors.primary, margin: 0 }}>Previsión de Ingresos</h4>
        <select style={{
          background: colors.bgSection, border: `1px solid ${colors.border}`,
          borderRadius: 8, padding: '4px 10px', fontSize: 12, color: colors.textSecondary,
          cursor: 'pointer', outline: 'none',
        }}>
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Año actual</option>
        </select>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8, paddingBottom: 8 }}>
        {CHART_DATA.map((d) => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{
              width: '100%', borderRadius: '4px 4px 0 0',
              height: `${d.pct}%`,
              background: d.accent ? colors.accent : d.active ? colors.primary : colors.bgSection,
              transition: 'background 0.2s',
              minHeight: 8,
            }} />
            <span style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 600 }}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent bookings ──────────────────────────────────────────────────────────

const RECENT_BOOKINGS = [
  { name: 'Elena Rodriguez', route: 'La Paz → Santa Cruz', amount: 'Bs. 120', status: 'Pagado', statusColor: '#16A34A', statusBg: '#DCFCE7' },
  { name: 'Marco Villegas', route: 'Uyuni → Potosí', amount: 'Bs. 85', status: 'Pagado', statusColor: '#16A34A', statusBg: '#DCFCE7' },
  { name: 'Sofía Mamani', route: 'Cochabamba → Sucre', amount: 'Bs. 95', status: 'Pendiente', statusColor: '#92400E', statusBg: '#FEF9C3' },
  { name: 'Juan Pérez', route: 'La Paz → Oruro', amount: 'Bs. 45', status: 'Pagado', statusColor: '#16A34A', statusBg: '#DCFCE7' },
];

function RecentBookings() {
  const router = useRouter();
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', height: 320 }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border}` }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: colors.primary, margin: 0 }}>Reservas Recientes</h4>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {RECENT_BOOKINGS.map((b, i) => (
          <div key={i} style={{
            padding: '10px 20px',
            borderBottom: i < RECENT_BOOKINGS.length - 1 ? `1px solid ${colors.border}` : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: `rgba(0,56,112,0.1)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: colors.primary,
              }}>
                {b.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{b.name}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>{b.route}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{b.amount}</div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                background: b.statusBg, color: b.statusColor,
              }}>
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push('/dashboard/reservations')}
        style={{
          width: '100%', padding: '12px 0', borderTop: `1px solid ${colors.border}`,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: colors.primary,
          borderRadius: '0 0 12px 12px',
        }}
      >
        Ver Todas las Reservas →
      </button>
    </div>
  );
}

// ─── Fleet status table ───────────────────────────────────────────────────────

const FLEET = [
  { id: 'BT-902', route: 'La Paz → Santa Cruz (Exprés)', operator: 'J. Condori', load: 90, status: 'En Movimiento', statusColor: '#16A34A', statusBg: '#DCFCE7' },
  { id: 'BT-744', route: 'Uyuni → San Pedro de Atacama', operator: 'R. Méndez', load: 60, status: 'Retrasado', statusColor: '#92400E', statusBg: '#FEF3C7' },
  { id: 'BT-112', route: 'Cochabamba → Villa Tunari', operator: 'L. Vargas', load: 30, status: 'En Movimiento', statusColor: '#16A34A', statusBg: '#DCFCE7' },
];

function FleetTable() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colors.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', marginTop: 24 }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border}`, background: colors.bgSection, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: colors.primary, margin: 0 }}>Estado de la Flota en Vivo</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ color: '#22C55E', label: 'A Tiempo' }, { color: '#EAB308', label: 'Retrasado' }].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', border: `1px solid ${colors.border}`, borderRadius: 99, fontSize: 11, color: colors.textSecondary, background: '#fff' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {isMobile ? (
        <div>
          {FLEET.map((v) => (
            <div key={v.id} style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 800, color: colors.textPrimary }}>{v.id}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 99, background: v.statusBg, color: v.statusColor }}>{v.status}</span>
              </div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>{v.route}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: colors.bgSection, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${v.load}%`, background: colors.primary, borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary }}>{v.load}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.bgSection }}>
                {['ID Vehículo', 'Ruta', 'Operador', 'Factor de Carga', 'Estado', 'Acción'].map((h) => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FLEET.map((v) => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '14px 20px', fontWeight: 800, color: colors.textPrimary }}>{v.id}</td>
                  <td style={{ padding: '14px 20px', color: colors.textSecondary, fontSize: 13 }}>{v.route}</td>
                  <td style={{ padding: '14px 20px', color: colors.textSecondary, fontSize: 13 }}>{v.operator}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: colors.bgSection, borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${v.load}%`, background: colors.primary, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>{v.load}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: v.statusBg, color: v.statusColor }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.primary, fontWeight: 600, fontSize: 13 }}>
                      Rastrear
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: colors.primary, margin: '0 0 4px', letterSpacing: -0.3 }}>
            Resumen del Panel
          </h2>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Métricas de logística y rendimiento financiero en tiempo real.
          </Text>
        </div>
        {!isMobile && (
          <Button
            icon={<PlusOutlined />}
            onClick={() => router.push('/dashboard/vehicles')}
            style={{
              borderColor: colors.border, color: colors.primary,
              fontWeight: 700, height: 40, padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <CarOutlined /> Registrar Nuevo Vehículo
          </Button>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon="🛣️" iconBg="rgba(0,56,112,0.1)" label="Rutas Activas" value="124" badge="+4.2%" badgeColor="#16A34A" />
        <StatCard icon="🚌" iconBg="rgba(253,208,0,0.2)" label="Vehículos en Tránsito" value="82" badge="En Servicio" badgeColor={colors.textSecondary} />
        <StatCard icon="📈" iconBg="rgba(255,119,120,0.15)" label="Ingresos Mensuales" value="Bs. 342.800" badge="↑ 12%" badgeColor="#16A34A" subtext="Comparado con el mes pasado" />
        <StatCard icon="⭐" iconBg="" label="Rendimiento de Flota" value="98.4%" badge="Excelente" badgeColor={colors.accent} subtext="Calificación de servicio" inverted />
      </div>

      {/* Chart + Recent bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
        <RevenueChart />
        <RecentBookings />
      </div>

      {/* Fleet table */}
      <FleetTable />
    </div>
  );
}
