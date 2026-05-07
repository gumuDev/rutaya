import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchSchedules, createReservation, getSeats } from './reservations.service';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockOkResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);
}

function mockErrorResponse(message: string) {
  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ message }),
  } as Response);
}

beforeEach(() => vi.clearAllMocks());

describe('searchSchedules', () => {
  it('calls the correct endpoint with encoded params', async () => {
    mockFetch.mockReturnValue(mockOkResponse([]));

    await searchSchedules('La Paz', 'Cochabamba', '2026-05-10', 2);

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('origin=La%20Paz');
    expect(calledUrl).toContain('destination=Cochabamba');
    expect(calledUrl).toContain('passengers=2');
  });

  it('returns the parsed schedule list', async () => {
    const mockData = [{ id: '1', origin: 'La Paz', destination: 'Cochabamba', price: 50 }];
    mockFetch.mockReturnValue(mockOkResponse(mockData));

    const result = await searchSchedules('La Paz', 'Cochabamba', '2026-05-10');

    expect(result).toEqual(mockData);
  });

  it('throws when response is not ok', async () => {
    mockFetch.mockReturnValue(mockErrorResponse('schedule_not_found'));

    await expect(searchSchedules('X', 'Y', '2026-05-10')).rejects.toThrow('schedule_not_found');
  });

  it('defaults passengers to 1 when not provided', async () => {
    mockFetch.mockReturnValue(mockOkResponse([]));

    await searchSchedules('La Paz', 'Cochabamba', '2026-05-10');

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('passengers=1');
  });
});

describe('createReservation', () => {
  it('posts the payload as JSON', async () => {
    mockFetch.mockReturnValue(mockOkResponse({ reservation: { code: 'ABC123' } }));

    const payload = {
      scheduleId: 'sched-1',
      passengerName: 'Juan',
      passengerPhone: '+591700',
      quantity: 1,
      paymentMethod: 'bank_transfer' as const,
      travelDate: '2026-05-10',
    };

    await createReservation(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/reservations'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  });

  it('throws with error message on failure', async () => {
    mockFetch.mockReturnValue(mockErrorResponse('insufficient_capacity'));

    await expect(createReservation({
      scheduleId: 's-1', passengerName: 'Juan', passengerPhone: '+591700',
      quantity: 99, paymentMethod: 'qr', travelDate: '2026-05-10',
    })).rejects.toThrow('insufficient_capacity');
  });
});

describe('getSeats', () => {
  it('calls the seats endpoint with scheduleId and date', async () => {
    mockFetch.mockReturnValue(mockOkResponse({ vehicleType: 'bus', capacity: 40, takenSeats: [1, 2] }));

    const result = await getSeats('sched-1', '2026-05-10');

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('/reservations/seats/sched-1');
    expect(calledUrl).toContain('date=2026-05-10');
    expect(result.takenSeats).toEqual([1, 2]);
  });
});
