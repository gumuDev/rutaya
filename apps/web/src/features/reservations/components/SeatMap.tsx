'use client';

import { Typography, Flex, Tag } from 'antd';
import { colors } from '@/shared/theme/colors';

const { Text } = Typography;

type ServiceType = 'normal' | 'semicama' | 'cama' | 'leito';

interface Props {
  capacity: number;
  serviceType?: ServiceType;
  takenSeats: number[];
  selectedSeats: number[];
  onToggle: (seat: number) => void;
  maxSelect: number;
}

// Returns rows of seat numbers; 0 = aisle gap
function generateLayout(capacity: number, serviceType: ServiceType): number[][][] {
  // For leito: two decks, each with 2+1 layout
  // Returns array of decks, each deck is array of rows
  if (serviceType === 'leito') {
    const seatsPerDeck = Math.ceil(capacity / 2);
    return [
      buildDeck(1, seatsPerDeck, 3),              // lower deck (seats 1..N)
      buildDeck(seatsPerDeck + 1, capacity, 3),   // upper deck (seats N+1..capacity)
    ];
  }
  // cama: 2+1 (3 seats per row)
  if (serviceType === 'cama') {
    return [buildDeck(1, capacity, 3)];
  }
  // normal / semicama: 2+2 (4 seats per row)
  return [buildDeck(1, capacity, 4)];
}

// Builds one deck: seats from `from` to `to`, seatsPerRow columns (3 → 2+1, 4 → 2+2)
function buildDeck(from: number, to: number, seatsPerRow: 3 | 4): number[][] {
  const rows: number[][] = [];
  let seat = from;
  while (seat <= to) {
    const remaining = to - seat + 1;
    if (seatsPerRow === 4) {
      if (remaining <= 2) {
        rows.push(Array.from({ length: remaining }, (_, i) => seat + i));
        break;
      }
      rows.push([seat, seat + 1, 0, seat + 2, seat + 3]);
      seat += 4;
    } else {
      // 2+1: left side has 2 seats, right side has 1
      if (remaining === 1) {
        rows.push([seat, 0, 0]);
        break;
      }
      if (remaining === 2) {
        rows.push([seat, seat + 1, 0]);
        break;
      }
      rows.push([seat, seat + 1, 0, seat + 2]);
      seat += 3;
    }
  }
  return rows;
}

function getSeatStyle(seat: number, takenSeats: number[], selectedSeats: number[]) {
  if (takenSeats.includes(seat)) {
    return { background: '#e8e8e8', border: '1px solid #d9d9d9', cursor: 'not-allowed', color: '#bbb' };
  }
  if (selectedSeats.includes(seat)) {
    return { background: colors.primary, border: `1px solid ${colors.primaryHover}`, cursor: 'pointer', color: '#fff' };
  }
  return { background: '#e6f4ff', border: `1px solid #91caff`, cursor: 'pointer', color: colors.secondary };
}

function SeatButton({ seat, takenSeats, selectedSeats, onToggle, maxSelect }: {
  seat: number; takenSeats: number[]; selectedSeats: number[];
  onToggle: (s: number) => void; maxSelect: number;
}) {
  const taken = takenSeats.includes(seat);
  const selected = selectedSeats.includes(seat);

  function handleClick() {
    if (taken) return;
    if (selected || selectedSeats.length < maxSelect) onToggle(seat);
  }

  return (
    <button
      onClick={handleClick}
      disabled={taken}
      style={{
        width: 36, height: 36, borderRadius: 6,
        fontSize: 11, fontWeight: 600,
        transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...getSeatStyle(seat, takenSeats, selectedSeats),
      }}
    >
      {taken ? '✕' : seat}
    </button>
  );
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  normal: 'Normal (2+2)',
  semicama: 'Semicama (2+2)',
  cama: 'Cama (2+1)',
  leito: 'Leito (2+1 · 2 pisos)',
};

export function SeatMap({ capacity, serviceType = 'normal', takenSeats, selectedSeats, onToggle, maxSelect }: Props) {
  const decks = generateLayout(capacity, serviceType);
  const deckLabels = serviceType === 'leito' ? ['Piso inferior', 'Piso superior'] : [null];

  return (
    <div>
      {/* Legend */}
      <Flex gap={16} style={{ marginBottom: 12 }} wrap="wrap" align="center">
        {[
          { color: '#e6f4ff', border: '#91caff', label: 'Disponible' },
          { color: colors.primary, border: colors.primaryHover, label: 'Seleccionado' },
          { color: '#e8e8e8', border: '#d9d9d9', label: 'Ocupado' },
        ].map(({ color, border, label }) => (
          <Flex key={label} align="center" gap={6}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: color, border: `1px solid ${border}` }} />
            <Text style={{ fontSize: 12 }}>{label}</Text>
          </Flex>
        ))}
        <Tag color="blue" style={{ marginLeft: 'auto', fontSize: 11 }}>{SERVICE_TYPE_LABELS[serviceType]}</Tag>
      </Flex>

      {/* Bus front */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'inline-block', background: colors.secondary, color: '#fff', borderRadius: '8px 8px 0 0', padding: '4px 24px', fontSize: 12 }}>
          🚌 Frente
        </div>
      </div>

      {/* Decks */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
        {decks.map((rows, deckIdx) => (
          <div key={deckIdx} style={{ flex: 1 }}>
            {deckLabels[deckIdx] && (
              <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <Text strong style={{ fontSize: 12, color: colors.secondary }}>{deckLabels[deckIdx]}</Text>
              </div>
            )}
            <div style={{ background: '#fafafa', border: `2px solid ${colors.border}`, borderRadius: 12, padding: '16px 12px', minWidth: 180 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {rows.map((row, rowIdx) => (
                  <div key={rowIdx} style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                    {row.map((seat, colIdx) =>
                      seat === 0 ? (
                        <div key={`gap-${colIdx}`} style={{ width: 28 }} />
                      ) : (
                        <SeatButton
                          key={seat}
                          seat={seat}
                          takenSeats={takenSeats}
                          selectedSeats={selectedSeats}
                          onToggle={onToggle}
                          maxSelect={maxSelect}
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {selectedSeats.length} de {maxSelect} asiento{maxSelect > 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''}
        </Text>
      </div>
    </div>
  );
}
