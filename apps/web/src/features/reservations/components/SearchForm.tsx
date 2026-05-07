'use client';

import { Form, AutoComplete, DatePicker, InputNumber, Button, Typography, Tabs } from 'antd';
import { SwapOutlined, SearchOutlined, EnvironmentOutlined, FileTextOutlined, QuestionCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dayjs from '@/shared/lib/dayjs';
import { colors } from '@/shared/theme/colors';
import { useCities } from '../hooks/useCities';

const { Title, Text } = Typography;

// ─── Navbar ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px',
    }}>
      {/* Logo */}
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
        <span style={{ color: colors.primary }}>Ruta</span>Ya
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        <a href="/recover" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileTextOutlined /> Mis tickets
        </a>
        <a href="#como-funciona" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <QuestionCircleOutlined /> ¿Cómo funciona?
        </a>
        <a href="#contacto" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <PhoneOutlined /> Contacto
        </a>
        <a href="/login" style={{
          background: colors.primary, color: '#fff', fontSize: 13, fontWeight: 700,
          padding: '6px 16px', borderRadius: 8, textDecoration: 'none',
        }}>
          Empresas
        </a>
      </div>
    </nav>
  );
}

// ─── Search card ─────────────────────────────────────────────────────────────

function SearchCard() {
  const router = useRouter();
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const { options: originOptions } = useCities(origin);
  const { options: destinationOptions } = useCities(destination);

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function handleSubmit(values: { date: dayjs.Dayjs; passengers: number }) {
    const date = values.date.format('YYYY-MM-DD');
    router.push(`/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=${values.passengers ?? 1}`);
  }

  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.22)', width: '100%', maxWidth: 820 }}>

      {/* Trip type tabs */}
      <Tabs
        activeKey={tripType}
        onChange={(k) => setTripType(k as 'one_way' | 'round_trip')}
        size="small"
        style={{ marginBottom: 16 }}
        items={[
          { key: 'one_way', label: '→ Solo ida' },
          { key: 'round_trip', label: '⇄ Ida y vuelta' },
        ]}
      />

      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>

          {/* Origen */}
          <div style={{ flex: '1 1 160px', minWidth: 130 }}>
            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Origen</label>
              <AutoComplete
                value={origin}
                options={originOptions}
                onSearch={setOrigin}
                onSelect={(v: string) => setOrigin(v)}
                onChange={(v: string) => setOrigin(v)}
                filterOption={false}
                size="large"
                style={{ width: '100%', marginTop: 4 }}
                placeholder="Ciudad de origen"
              />
            </div>
          </div>

          {/* Swap */}
          <div style={{ paddingBottom: 4 }}>
            <Button type="text" icon={<SwapOutlined style={{ fontSize: 16, color: colors.secondary }} />} onClick={handleSwap}
              style={{ border: `1px solid ${colors.border}`, borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            />
          </div>

          {/* Destino */}
          <div style={{ flex: '1 1 160px', minWidth: 130 }}>
            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Destino</label>
              <AutoComplete
                value={destination}
                options={destinationOptions}
                onSearch={setDestination}
                onSelect={(v: string) => setDestination(v)}
                onChange={(v: string) => setDestination(v)}
                filterOption={false}
                size="large"
                style={{ width: '100%', marginTop: 4 }}
                placeholder="Ciudad de destino"
              />
            </div>
          </div>

          {/* Fecha ida */}
          <div style={{ flex: '1 1 130px', minWidth: 120 }}>
            <Form.Item name="date" label={<span style={labelStyle}>Salida</span>} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <DatePicker size="large" style={{ width: '100%' }} format="D MMM YYYY" disabledDate={(d) => d.isBefore(dayjs(), 'day')} placeholder="Fecha" />
            </Form.Item>
          </div>

          {/* Fecha vuelta (solo ida y vuelta) */}
          {tripType === 'round_trip' && (
            <div style={{ flex: '1 1 130px', minWidth: 120 }}>
              <Form.Item name="returnDate" label={<span style={labelStyle}>Vuelta</span>} style={{ marginBottom: 0 }}>
                <DatePicker size="large" style={{ width: '100%' }} format="D MMM YYYY" disabledDate={(d) => d.isBefore(dayjs(), 'day')} placeholder="Fecha" />
              </Form.Item>
            </div>
          )}

          {/* Pasajeros */}
          <div style={{ flex: '0 1 100px', minWidth: 88 }}>
            <Form.Item name="passengers" label={<span style={labelStyle}>Pasajeros</span>} style={{ marginBottom: 0 }} initialValue={1}>
              <InputNumber size="large" min={1} max={20} style={{ width: '100%' }} prefix="👤" />
            </Form.Item>
          </div>

          {/* Botón */}
          <div style={{ flex: '0 1 110px', minWidth: 100, paddingBottom: 1 }}>
            <Button type="primary" htmlType="submit" size="large" icon={<SearchOutlined />}
              style={{ width: '100%', height: 40, borderRadius: 8, fontWeight: 700, background: colors.primary, borderColor: colors.primary }}>
              Buscar
            </Button>
          </div>

        </div>
      </Form>
    </div>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

const STEPS = [
  { icon: '🔍', title: 'Busca tu ruta', desc: 'Ingresa origen, destino, fecha y número de pasajeros.' },
  { icon: '🚌', title: 'Elige tu viaje', desc: 'Selecciona el horario y empresa que más te convenga.' },
  { icon: '💳', title: 'Paga fácil', desc: 'Transfiere o escanea el QR de la empresa y sube tu comprobante.' },
  { icon: '🎫', title: 'Recibe tu ticket', desc: 'Guarda tu ticket digital y preséntalo al abordar.' },
];

function HowItWorks() {
  return (
    <section id="como-funciona" style={{ background: '#fff', padding: '72px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={2} style={{ color: colors.secondary, margin: 0 }}>¿Cómo funciona?</Title>
          <Text type="secondary">Reserva tu pasaje en 4 simples pasos</Text>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: '1 1 180px', maxWidth: 200, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: colors.accent, border: `2px solid ${colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>
                {s.icon}
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.primary, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-8px auto 12px' }}>
                {i + 1}
              </div>
              <Text strong style={{ display: 'block', color: colors.secondary, marginBottom: 6 }}>{s.title}</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>{s.desc}</Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer / Contacto ────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contacto" style={{ background: colors.secondary, color: 'rgba(255,255,255,0.7)', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
          <span style={{ color: colors.primary }}>Ruta</span>Ya
        </div>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          Plataforma de reserva de pasajes interprovinciales en Bolivia
        </Text>
        <div style={{ marginTop: 20, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/recover" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>Recuperar ticket</a>
          <a href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>Acceso empresas</a>
          <a href="/register" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>Registrar empresa</a>
        </div>
        <div style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} RutaYa · Bolivia
        </div>
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
      {/* Hero */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 16px 48px',
        background: `linear-gradient(135deg, ${colors.secondary} 0%, #0f2440 60%, #1a3a6b 100%)`,
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(249,115,22,0.06)', pointerEvents: 'none' }} />

        <Navbar />

        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 24, zIndex: 1 }}>
          <Title style={{ color: '#fff', fontSize: 42, margin: '0 0 8px', lineHeight: 1.15 }}>
            Tu viaje empieza <span style={{ color: colors.primary }}>aquí</span>
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Reserva pasajes interprovinciales en Bolivia de forma rápida y segura
          </Text>
        </div>

        {/* Search card */}
        <div style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <SearchCard />
        </div>

        {/* Quick link */}
        <div style={{ marginTop: 20, zIndex: 1 }}>
          <a href="/recover" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'underline' }}>
            ¿Ya tienes una reserva? Recupera tu ticket →
          </a>
        </div>
      </div>

      {/* How it works */}
      <HowItWorks />

      {/* Footer */}
      <Footer />
    </div>
  );
}
