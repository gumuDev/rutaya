export class Schedule {
  constructor(
    public readonly id: string,
    public readonly routeId: string,
    public readonly vehicleId: string,
    public readonly companyId: string,
    public departureTime: string,
    public days: string[],
    public price: number,
    public active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
