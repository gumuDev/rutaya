import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchSchedulesPos, createPosReservation } from './pos.service';

vi.mock('@/features/auth/hooks/useAuth', () => ({ getToken: () => 'test-token' }));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockOk(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);
}
function mockError(message: string) {
  return Promise.resolve({ ok: false, json: () => Promise.resolve({ message }) } as Response);
}

beforeEach(() => vi.clearAllMocks());

describe('searchSchedulesPos', () => {
  it('calls search endpoint with encoded params', async () => {
    mockFetch.mockReturnValue(mockOk([]));

    await searchSchedulesPos('La Paz', 'Cochabamba', '2026-05-10');

    const url: string = mockFetch.mock.calls[0][0];
    expect(url).toContain('origin=La%20Paz');
    expect(url).toContain('destination=Cochabamba');
  });

  it('throws on error', async () => {
    mockFetch.mockReturnValue(mockError('load_failed'));
    await expect(searchSchedulesPos('X', 'Y', '2026-05-10')).rejects.toThrow();
  });
});

describe('createPosReservation', () => {
  it('posts to /reservations/pos', async () => {
    mockFetch.mockReturnValue(mockOk({ reservation: { code: 'ABC123', status: 'confirmed' } }));

    const payload = {
      scheduleId: 'sched-1', passengerName: 'Juan', passengerPhone: '+591700',
      quantity: 1, paymentMethod: 'cash' as const, travelDate: '2026-05-10',
    };

    await createPosReservation(payload);

    const url: string = mockFetch.mock.calls[0][0];
    const opts = mockFetch.mock.calls[0][1];
    expect(url).toContain('/reservations/pos');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body).paymentMethod).toBe('cash');
  });

  it('throws with server error message on failure', async () => {
    mockFetch.mockReturnValue(mockError('insufficient_capacity'));
    await expect(createPosReservation({
      scheduleId: 's-1', passengerName: 'Juan', passengerPhone: '+591700',
      quantity: 99, paymentMethod: 'cash', travelDate: '2026-05-10',
    })).rejects.toThrow('insufficient_capacity');
  });
});
