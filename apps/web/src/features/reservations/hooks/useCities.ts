import { useState, useEffect, useRef } from 'react';
import { searchCities, City } from '../services/cities.service';

export function useCities(query: string) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setOptions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const cities: City[] = await searchCities(query);
        setOptions(cities.map((c) => ({
          value: c.name,
          label: `${c.name} — ${c.department}`,
        })));
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return { options, loading };
}
