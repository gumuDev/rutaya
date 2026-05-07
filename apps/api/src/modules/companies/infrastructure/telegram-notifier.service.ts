import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ReservationNotification {
  code: string;
  origin: string;
  destination: string;
  departureTime: string;
  passengerName: string;
  passengerPhone: string;
  quantity: number;
  paymentMethod: string | null;
  proofImageUrl: string | null;
  status: string;
}

@Injectable()
export class TelegramNotifierService {
  private readonly logger = new Logger(TelegramNotifierService.name);
  private readonly token: string;

  constructor(private readonly config: ConfigService) {
    this.token = this.config.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }

  async sendReservationNotification(chatId: string, data: ReservationNotification): Promise<void> {
    if (!this.token || !chatId) return;

    const statusEmoji: Record<string, string> = {
      pending_payment: '💳',
      pending: '🕐',
      confirmed: '✅',
    };

    const paymentLabel: Record<string, string> = {
      bank_transfer: 'Depósito bancario',
      qr: 'Pago QR',
    };

    const text =
      `🎫 *Nueva reserva*\n\n` +
      `📋 Código: \`${data.code}\`\n` +
      `🚌 Ruta: ${data.origin} → ${data.destination}\n` +
      `🕐 Horario: ${data.departureTime}\n` +
      `👤 Pasajero: ${data.passengerName}\n` +
      `📱 Teléfono: ${data.passengerPhone}\n` +
      `👥 Cantidad: ${data.quantity} pax\n` +
      `💰 Pago: ${data.paymentMethod ? paymentLabel[data.paymentMethod] ?? data.paymentMethod : 'No especificado'}\n` +
      `${data.proofImageUrl ? `📎 Comprobante: ${data.proofImageUrl}\n` : '⚠️ Sin comprobante aún\n'}` +
      `${statusEmoji[data.status] ?? '📊'} Estado: ${data.status}`;

    try {
      await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      });
    } catch (err) {
      this.logger.error(`Failed to send Telegram notification to ${chatId}`, err);
    }
  }
}
