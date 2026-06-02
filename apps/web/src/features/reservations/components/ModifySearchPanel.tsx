'use client';

import { useState } from 'react';
import { Button, Form, AutoComplete, DatePicker, InputNumber } from 'antd';
import { CloseOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from '@/shared/lib/dayjs';
import { colors } from '@/shared/theme/colors';
import { useCities } from '../hooks/useCities';

export function ModifySearchPanel({ defaultOrigin, defaultDestination, defaultDate, defaultPassengers, onClose }: {
  defaultOrigin: string;
  defaultDestination: string;
  defaultDate: string;
  defaultPassengers: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [originInput, setOriginInput]           = useState(defaultOrigin);
  const [destinationInput, setDestinationInput] = useState(defaultDestination);
  const [date, setDate]                         = useState<dayjs.Dayjs | null>(defaultDate ? dayjs(defaultDate) : null);
  const [passengers, setPassengers]             = useState(Number(defaultPassengers) || 1);
  const [swapped, setSwapped]                   = useState(false);

  const { options: originOptions }      = useCities(originInput);
  const { options: destinationOptions } = useCities(destinationInput);

  function swap() {
    const tmp = originInput;
    setOriginInput(destinationInput);
    setDestinationInput(tmp);
    setSwapped(s => !s);
  }

  function handleSearch() {
    if (!originInput || !destinationInput || !date) return;
    router.push(
      `/search?origin=${encodeURIComponent(originInput)}&destination=${encodeURIComponent(destinationInput)}&date=${date.format('YYYY-MM-DD')}&passengers=${passengers}`
    );
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    height: 48, borderRadius: 10, borderColor: colors.border, fontSize: 14, width: '100%',
  };
  const fieldLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: colors.textSecondary,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <div style={{
      background: colors.bgCard,
      borderBottom: `1px solid ${colors.border}`,
      borderTop: `1px solid ${colors.border}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.primary }}>Modificar búsqueda</span>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} size="small" />
        </div>

        <Form layout="vertical" style={{ margin: 0 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <div style={fieldLabel}>Origen</div>
              <AutoComplete value={originInput} options={originOptions}
                onSearch={setOriginInput} onSelect={setOriginInput} style={inputStyle} />
            </div>

            <div style={{ flexShrink: 0, paddingBottom: 4 }}>
              <Button
                icon={<SwapOutlined style={{ transform: swapped ? 'scaleX(-1)' : 'none', transition: 'transform 0.3s' }} />}
                onClick={swap} shape="circle"
                style={{ borderColor: colors.border, color: colors.primary, width: 40, height: 40 }}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <div style={fieldLabel}>Destino</div>
              <AutoComplete value={destinationInput} options={destinationOptions}
                onSearch={setDestinationInput} onSelect={setDestinationInput} style={inputStyle} />
            </div>

            <div style={{ flex: '1 1 140px', minWidth: 130 }}>
              <div style={fieldLabel}>Fecha</div>
              <DatePicker
                value={date} onChange={setDate} format="DD/MM/YYYY" allowClear={false}
                disabledDate={d => d.isBefore(dayjs().startOf('day'))}
                style={{ ...inputStyle }}
              />
            </div>

            <div style={{ flex: '0 0 100px', minWidth: 90 }}>
              <div style={fieldLabel}>Pasajeros</div>
              <InputNumber min={1} max={20} value={passengers}
                onChange={v => setPassengers(v ?? 1)} style={{ ...inputStyle }} />
            </div>

            <div style={{ flexShrink: 0, paddingBottom: 4 }}>
              <Button
                icon={<SearchOutlined />}
                onClick={handleSearch}
                disabled={!originInput || !destinationInput || !date}
                style={{
                  background: colors.accent, borderColor: colors.accent,
                  color: colors.navy, fontWeight: 700,
                  height: 48, paddingInline: 24, borderRadius: 10, fontSize: 14,
                }}
              >
                Buscar
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
