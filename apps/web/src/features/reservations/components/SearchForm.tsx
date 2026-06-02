'use client';

import { Form, AutoComplete, DatePicker, InputNumber, Button, Grid } from 'antd';
import { SwapOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dayjs from '@/shared/lib/dayjs';
import { colors } from '@/shared/theme/colors';
import { useCities } from '../hooks/useCities';

const { useBreakpoint } = Grid;

// ─── Navbar ─────────────────────────────────────────────────────────────────

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
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: colors.primary, letterSpacing: -0.5, lineHeight: 1 }}>
            RutaYa
          </span>
        </a>

        {/* Links — desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <a href="/" style={{
              color: colors.textSecondary, fontSize: 15, fontWeight: 700, textDecoration: 'none',
              borderBottom: `2px solid ${colors.accent}`, paddingBottom: 2,
            }}>Buscar</a>
            <a href="/login" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>
              Para Empresas
            </a>
            <a href="/recover" style={{ color: colors.textSecondary, fontSize: 15, textDecoration: 'none' }}>
              Mis Viajes
            </a>
          </div>
        )}

        {/* CTA */}
        <a href="/login" style={{
          background: colors.accent, color: colors.navy,
          fontSize: 14, fontWeight: 700,
          padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
          transition: 'background 0.2s',
        }}>
          {isMobile ? 'Ingresar' : 'Iniciar Sesión/Registrarse'}
        </a>
      </nav>
    </header>
  );
}

// ─── Search card ─────────────────────────────────────────────────────────────

function SearchCard() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const { options: originOptions } = useCities(origin);
  const { options: destinationOptions } = useCities(destination);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function handleSubmit(values: { date: dayjs.Dayjs; passengers: number }) {
    const date = values.date.format('YYYY-MM-DD');
    router.push(
      `/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=${values.passengers ?? 1}`
    );
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 500, color: colors.textSecondary,
    letterSpacing: '0.01em', display: 'block', marginBottom: 4,
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(8px)',
      borderRadius: 12,
      padding: isMobile ? '20px 16px' : '24px 32px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      width: '100%',
      maxWidth: 900,
      border: '1px solid rgba(255,255,255,0.2)',
    }}>
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr 1fr auto',
          gap: 12,
          alignItems: 'flex-end',
        }}>
          {/* Origen */}
          <div>
            <label style={labelStyle}>
              <EnvironmentOutlined style={{ marginRight: 4, color: colors.primary }} />
              Origen
            </label>
            <AutoComplete
              value={origin}
              options={originOptions}
              onSearch={setOrigin}
              onSelect={(v: string) => setOrigin(v)}
              onChange={(v: string) => setOrigin(v)}
              filterOption={false}
              size="large"
              style={{ width: '100%' }}
              placeholder="Ciudad de salida"
            />
          </div>

          {/* Swap */}
          <div style={{ paddingBottom: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="text"
              icon={<SwapOutlined style={{ fontSize: 16, color: colors.primary }} />}
              onClick={handleSwap}
              style={{
                border: `1px solid ${colors.border}`, borderRadius: 8,
                width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
              }}
            />
          </div>

          {/* Destino */}
          <div>
            <label style={labelStyle}>
              <EnvironmentOutlined style={{ marginRight: 4, color: colors.primary }} />
              Destino
            </label>
            <AutoComplete
              value={destination}
              options={destinationOptions}
              onSearch={setDestination}
              onSelect={(v: string) => setDestination(v)}
              onChange={(v: string) => setDestination(v)}
              filterOption={false}
              size="large"
              style={{ width: '100%' }}
              placeholder="A dónde vas"
            />
          </div>

          {/* Fecha */}
          <Form.Item
            name="date"
            label={<span style={labelStyle}>Fecha de Salida</span>}
            rules={[{ required: true, message: 'Selecciona una fecha' }]}
            style={{ marginBottom: 0 }}
          >
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              format="D MMM YYYY"
              disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              placeholder="Seleccionar fecha"
            />
          </Form.Item>

          {/* Botón buscar */}
          <div style={{ paddingBottom: 1 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SearchOutlined />}
              style={{
                width: '100%', height: 40,
                background: colors.accent, borderColor: colors.accent,
                color: colors.navy, fontWeight: 700, borderRadius: 8,
              }}
            >
              {!isMobile && 'Buscar Pasajes'}
            </Button>
          </div>
        </div>
      </Form>

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <a href="/recover" style={{ color: 'rgba(26,28,30,0.5)', fontSize: 13, textDecoration: 'none' }}>
          ¿Ya tienes una reserva? Recupera tu ticket →
        </a>
      </div>
    </div>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon: '✓',
    title: 'Confianza',
    desc: 'Operadores verificados y pagos seguros para cada viaje por el Altiplano.',
  },
  {
    icon: '◎',
    title: 'Soporte 24/7',
    desc: 'Nuestro equipo dedicado está listo para asistirte en cualquier momento.',
  },
  {
    icon: '$',
    title: 'Mejores Precios',
    desc: 'Sin cargos ocultos. Las tarifas más competitivas para rutas de lujo y expresas.',
  },
];

function WhyUs() {
  return (
    <section style={{ background: colors.bg, padding: '80px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.primary, margin: '0 0 12px', letterSpacing: -0.3 }}>
            ¿Por qué elegirnos?
          </h2>
          <div style={{ height: 4, width: 56, background: colors.accent, margin: '0 auto', borderRadius: 99 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {WHY_ITEMS.map((item) => (
            <div key={item.title} style={{
              background: colors.bgCard, padding: 32, borderRadius: 12,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 8px rgba(0,35,74,0.04)',
              textAlign: 'center',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(0,56,112,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 24, fontWeight: 900, color: colors.primary,
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.textPrimary, margin: '0 0 10px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Popular Routes ──────────────────────────────────────────────────────────

const ROUTES = [
  {
    label: 'Expreso Diario',
    labelColor: colors.accent,
    labelText: colors.navy,
    title: 'La Paz a Cochabamba',
    info: 'Desde Bs. 80 · 7h de viaje',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    span: 8,
  },
  {
    label: 'Lujo Semi-Cama',
    labelColor: '#770015',
    labelText: '#ff7778',
    title: 'Santa Cruz a Sucre',
    info: 'Desde Bs. 120 · 12h de viaje',
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    span: 4,
    rowSpan: 2,
  },
  {
    label: '',
    labelColor: '',
    labelText: '',
    title: 'Potosí a Uyuni',
    info: 'Desde Bs. 50 · 4h de viaje',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    span: 4,
  },
  {
    label: '',
    labelColor: '',
    labelText: '',
    title: 'Oruro a La Paz',
    info: 'Desde Bs. 40 · 3h de viaje',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    span: 4,
  },
];

function PopularRoutes() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <section style={{ padding: '80px 24px', background: colors.bgSection }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: colors.primary, margin: '0 0 6px', letterSpacing: -0.3 }}>
              Rutas Populares
            </h2>
            <p style={{ fontSize: 15, color: colors.textSecondary, margin: 0 }}>
              Explora las conexiones más frecuentes en toda Bolivia.
            </p>
          </div>
          <a href="/search" style={{ color: colors.primary, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ver todas las rutas →
          </a>
        </div>

        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ROUTES.map((r) => (
              <RouteCard key={r.title} route={r} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(2, 280px)', gap: 16 }}>
            <div style={{ gridColumn: '1 / 9', gridRow: '1', position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
              <RouteCardInner route={ROUTES[0]} />
            </div>
            <div style={{ gridColumn: '9 / 13', gridRow: '1 / 3', position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
              <RouteCardInner route={ROUTES[1]} />
            </div>
            <div style={{ gridColumn: '1 / 7', gridRow: '2', position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
              <RouteCardInner route={ROUTES[2]} />
            </div>
            <div style={{ gridColumn: '7 / 9', gridRow: '2', position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
              <RouteCardInner route={ROUTES[3]} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RouteCardInner({ route }: { route: typeof ROUTES[0] }) {
  return (
    <>
      <img
        src={route.img}
        alt={route.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {route.label && (
          <span style={{
            background: route.labelColor, color: route.labelText,
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
            alignSelf: 'flex-start', marginBottom: 8,
          }}>
            {route.label}
          </span>
        )}
        <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>{route.title}</h4>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 }}>{route.info}</p>
      </div>
    </>
  );
}

function RouteCard({ route }: { route: typeof ROUTES[0] }) {
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 180, border: `1px solid ${colors.border}` }}>
      <RouteCardInner route={route} />
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const links = [
    { label: 'Sobre Nosotros', href: '#' },
    { label: 'Términos de Servicio', href: '#' },
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Centro de Ayuda', href: '#' },
    { label: 'Contacto', href: '#' },
  ];

  return (
    <footer style={{ background: colors.primary, borderTop: `1px solid rgba(255,255,255,0.1)` }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '48px 24px',
        display: 'flex', flexDirection: 'column', gap: 24,
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6 }}>RutaYa</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, maxWidth: 320 }}>
            Conectando el corazón de Sudamérica con transporte confiable y programado.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
          © {new Date().getFullYear()} RutaYa. Todos los derechos reservados. Transporte de precisión por los Andes.
        </p>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SearchForm() {
  const t = useTranslations('search');
  void t;

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: 'relative',
        minHeight: 680,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=85"
            alt="Salar de Uyuni Bolivia"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,35,74,0.45) 0%, rgba(0,35,74,0.72) 100%)',
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 1280, margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 700, color: '#fff', margin: '0 0 40px',
            lineHeight: 1.1, letterSpacing: -0.02,
            maxWidth: 700, marginLeft: 'auto', marginRight: 'auto',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            Transporte de Precisión por los Andes
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SearchCard />
          </div>
        </div>
      </section>

      <WhyUs />
      <PopularRoutes />
      <Footer />
    </div>
  );
}
