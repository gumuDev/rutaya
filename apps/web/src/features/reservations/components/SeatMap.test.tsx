import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SeatMap } from './SeatMap';

// Ant Design components work in jsdom without extra config
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('SeatMap — generateLayout', () => {
  it('renders the correct number of seat buttons for normal layout', () => {
    render(
      <SeatMap
        capacity={8}
        serviceType="normal"
        takenSeats={[]}
        selectedSeats={[]}
        onToggle={vi.fn()}
        maxSelect={4}
      />
    );
    // 8 seats → 2 rows of 4 (2+2)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(8);
  });

  it('shows taken seats with ✕ and disables them', () => {
    render(
      <SeatMap
        capacity={4}
        serviceType="normal"
        takenSeats={[1, 2]}
        selectedSeats={[]}
        onToggle={vi.fn()}
        maxSelect={4}
      />
    );
    const disabledButtons = screen.getAllByRole('button', { hidden: false })
      .filter((b) => b.hasAttribute('disabled'));
    expect(disabledButtons).toHaveLength(2);
  });

  it('calls onToggle when an available seat is clicked', () => {
    const onToggle = vi.fn();
    render(
      <SeatMap
        capacity={4}
        serviceType="normal"
        takenSeats={[]}
        selectedSeats={[]}
        onToggle={onToggle}
        maxSelect={4}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('does not call onToggle when a taken seat is clicked', () => {
    const onToggle = vi.fn();
    render(
      <SeatMap
        capacity={4}
        serviceType="normal"
        takenSeats={[1]}
        selectedSeats={[]}
        onToggle={onToggle}
        maxSelect={4}
      />
    );
    const disabledButton = screen.getAllByRole('button').find((b) => b.hasAttribute('disabled'))!;
    fireEvent.click(disabledButton);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('does not allow selecting more seats than maxSelect', () => {
    const onToggle = vi.fn();
    render(
      <SeatMap
        capacity={4}
        serviceType="normal"
        takenSeats={[]}
        selectedSeats={[1, 2]} // already at max
        onToggle={onToggle}
        maxSelect={2}
      />
    );
    const buttons = screen.getAllByRole('button');
    // Click on seat 3 (not selected, not taken) — should NOT call onToggle
    fireEvent.click(buttons[2]);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('renders two deck labels for leito layout', () => {
    render(
      <SeatMap
        capacity={12}
        serviceType="leito"
        takenSeats={[]}
        selectedSeats={[]}
        onToggle={vi.fn()}
        maxSelect={4}
      />
    );
    expect(screen.getByText('Piso inferior')).toBeInTheDocument();
    expect(screen.getByText('Piso superior')).toBeInTheDocument();
  });

  it('shows correct selected seat count in summary', () => {
    render(
      <SeatMap
        capacity={8}
        serviceType="normal"
        takenSeats={[]}
        selectedSeats={[1, 3]}
        onToggle={vi.fn()}
        maxSelect={4}
      />
    );
    expect(screen.getByText(/2 de 4/)).toBeInTheDocument();
  });
});
