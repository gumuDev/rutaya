import { Schedule } from './schedule.entity';

export abstract class ScheduleRepository {
  abstract findById(id: string, companyId: string): Promise<Schedule | null>;
  abstract findByCompany(companyId: string): Promise<Schedule[]>;
  abstract save(schedule: Schedule): Promise<Schedule>;
  abstract delete(id: string, companyId: string): Promise<void>;
}
