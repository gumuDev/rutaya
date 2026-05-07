import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export const TZ = 'America/La_Paz';

// Returns current date/time in Bolivia timezone
export function nowBolivia() {
  return dayjs().tz(TZ);
}

// Parses a YYYY-MM-DD date string as a Bolivia date (avoids UTC midnight shift)
export function parseDate(dateStr: string) {
  return dayjs.tz(dateStr, TZ);
}

export default dayjs;
