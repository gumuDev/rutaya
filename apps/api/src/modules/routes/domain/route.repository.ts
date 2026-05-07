import { Route } from './route.entity';

export abstract class RouteRepository {
  abstract findById(id: string, companyId: string): Promise<Route | null>;
  abstract findByCompany(companyId: string): Promise<Route[]>;
  abstract save(route: Route): Promise<Route>;
  abstract delete(id: string, companyId: string): Promise<void>;
  abstract hasActiveSchedules(id: string): Promise<boolean>;
}
