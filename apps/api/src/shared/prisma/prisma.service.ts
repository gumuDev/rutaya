import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client!: PrismaClient;

  async onModuleInit() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    this._client = new PrismaClient({ adapter });
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }

  get company() {
    return this._client.company;
  }

  get vehicle() {
    return this._client.vehicle;
  }

  get route() {
    return this._client.route;
  }

  get schedule() {
    return this._client.schedule;
  }

  get reservation() {
    return this._client.reservation;
  }

  get seatReservation() {
    return this._client.seatReservation;
  }

  get city() {
    return this._client.city;
  }

  get $transaction() {
    return this._client.$transaction.bind(this._client);
  }
}
