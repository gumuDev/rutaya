import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

const BUCKET = 'images';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  async upload(file: Express.Multer.File): Promise<string> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new InternalServerErrorException('storage_not_configured');
    }

    const ext = file.originalname.split('.').pop() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const res = await fetch(
      `${supabaseUrl}/storage/v1/object/${BUCKET}/${fileName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': file.mimetype,
          'x-upsert': 'true',
        },
        body: file.buffer as unknown as BodyInit,
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      this.logger.error(`Supabase upload failed [${res.status}]: ${JSON.stringify(err)}`);
      throw new InternalServerErrorException(err.message ?? 'upload_failed');
    }

    return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;
  }
}
