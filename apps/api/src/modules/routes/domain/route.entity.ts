export class Route {
  constructor(
    public readonly id: string,
    public origin: string,
    public destination: string,
    public basePrice: number,
    public readonly companyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
