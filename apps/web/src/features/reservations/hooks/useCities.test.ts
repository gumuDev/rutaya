import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCities } from './useCities';
import * as citiesService from '../services/cities.service';

vi.mock('../services/cities.service');

const mockSearchCities = vi.mocked(citiesService.searchCities);

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useCities', () => {
  it('returns empty options for queries shorter than 2 chars', () => {
    const { result } = renderHook(() => useCities('a'));
    expect(result.current.options).toEqual([]);
    expect(mockSearchCities).not.toHaveBeenCalled();
  });

  it('returns empty options for empty query', () => {
    const { result } = renderHook(() => useCities(''));
    expect(result.current.options).toEqual([]);
  });

  it('does not call searchCities before debounce fires', async () => {
    mockSearchCities.mockResolvedValue([]);
    renderHook(() => useCities('co'));

    await act(async () => { vi.advanceTimersByTime(100); });

    expect(mockSearchCities).not.toHaveBeenCalled();
  });

  it('fetches cities and maps them to options after debounce', async () => {
    mockSearchCities.mockResolvedValue([
      { id: '1', name: 'Cochabamba', department: 'Cochabamba' },
      { id: '2', name: 'Colquiri', department: 'La Paz' },
    ]);

    const { result } = renderHook(() => useCities('co'));

    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });

    expect(result.current.options).toHaveLength(2);
    expect(result.current.options[0]).toEqual({
      value: 'Cochabamba',
      label: 'Cochabamba — Cochabamba',
    });
  });

  it('calls searchCities with the exact query', async () => {
    mockSearchCities.mockResolvedValue([]);
    renderHook(() => useCities('or'));

    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });

    expect(mockSearchCities).toHaveBeenCalledWith('or');
  });

  it('clears options immediately when query drops below threshold', () => {
    const { result, rerender } = renderHook(({ q }) => useCities(q), {
      initialProps: { q: 'co' },
    });

    rerender({ q: 'c' });

    expect(result.current.options).toEqual([]);
    expect(mockSearchCities).not.toHaveBeenCalled();
  });
});
