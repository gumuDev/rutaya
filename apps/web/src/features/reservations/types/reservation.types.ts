export interface PaymentInfo {
  bankName: string | null;
  bankAccount: string | null;
  bankAccountHolder: string | null;
  qrImageUrl: string | null;
}

export interface ScheduleResult {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  price: number;
  companyName: string;
  vehicleType: string;
  serviceType: string;
  capacity: number;
  available: number;
  payment: PaymentInfo;
}

export type PaymentMethod = 'bank_transfer' | 'qr';

export interface CreateReservationPayload {
  scheduleId: string;
  passengerName: string;
  passengerPhone: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  proofImageUrl?: string;
  travelDate: string;
  selectedSeats?: number[];
}

export interface SeatsResponse {
  vehicleType: string;
  serviceType: string;
  capacity: number;
  takenSeats: number[];
}

export interface ReservationResult {
  reservation: {
    id: string;
    code: string;
    status: string;
    quantity: number;
    passengerName: string;
    passengerPhone: string;
    expiresAt: string;
  };
  scheduleInfo: {
    origin: string;
    destination: string;
    departureTime: string;
    price: number;
    companyName: string;
  };
}
