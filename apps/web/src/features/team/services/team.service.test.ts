import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listOperators, createOperator, updateOperator, deleteOperator } from './team.service';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  getToken: () => 'test-token',
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockOk(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);
}

function mockError(message: string) {
  return Promise.resolve({ ok: false, json: () => Promise.resolve({ message }) } as Response);
}

beforeEach(() => vi.clearAllMocks());

describe('listOperators', () => {
  it('fetches operators from the correct endpoint', async () => {
    mockFetch.mockReturnValue(mockOk([]));

    await listOperators();

    const url: string = mockFetch.mock.calls[0][0];
    expect(url).toContain('/companies/operators');
  });

  it('includes Authorization header', async () => {
    mockFetch.mockReturnValue(mockOk([]));

    await listOperators();

    const opts = mockFetch.mock.calls[0][1];
    expect(opts.headers.Authorization).toBe('Bearer test-token');
  });

  it('throws on error response', async () => {
    mockFetch.mockReturnValue(mockError('load_failed'));
    await expect(listOperators()).rejects.toThrow('load_failed');
  });
});

describe('createOperator', () => {
  it('posts to the operators endpoint', async () => {
    mockFetch.mockReturnValue(mockOk({ id: 'op-1', name: 'Ana', email: 'ana@test.com' }));

    await createOperator({ name: 'Ana', email: 'ana@test.com', password: 'secret123' });

    const url: string = mockFetch.mock.calls[0][0];
    const opts = mockFetch.mock.calls[0][1];
    expect(url).toContain('/companies/operators');
    expect(opts.method).toBe('POST');
  });

  it('throws with server error message on conflict', async () => {
    mockFetch.mockReturnValue(mockError('email_already_registered'));

    await expect(createOperator({ name: 'Ana', email: 'dup@test.com', password: '123456' }))
      .rejects.toThrow('email_already_registered');
  });
});

describe('updateOperator', () => {
  it('sends PUT to the correct endpoint', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: true } as Response));

    await updateOperator('op-1', { name: 'Nuevo Nombre' });

    const url: string = mockFetch.mock.calls[0][0];
    const opts = mockFetch.mock.calls[0][1];
    expect(url).toContain('/companies/operators/op-1');
    expect(opts.method).toBe('PUT');
    expect(JSON.parse(opts.body)).toEqual({ name: 'Nuevo Nombre' });
  });

  it('throws with server error message on conflict', async () => {
    mockFetch.mockReturnValue(Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'email_already_registered' }),
    } as Response));

    await expect(updateOperator('op-1', { email: 'taken@test.com' }))
      .rejects.toThrow('email_already_registered');
  });
});

describe('deleteOperator', () => {
  it('sends DELETE to the correct endpoint', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: true } as Response));

    await deleteOperator('op-1');

    const url: string = mockFetch.mock.calls[0][0];
    const opts = mockFetch.mock.calls[0][1];
    expect(url).toContain('/companies/operators/op-1');
    expect(opts.method).toBe('DELETE');
  });

  it('throws on error response', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: false } as Response));
    await expect(deleteOperator('op-1')).rejects.toThrow('delete_failed');
  });
});
