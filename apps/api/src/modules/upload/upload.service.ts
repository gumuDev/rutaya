import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  // TODO: reemplazar mock por Supabase Storage cuando se configure
  // Cuando tengas las credenciales, reemplaza este método con:
  //
  //   const fileExt = file.originalname.split('.').pop();
  //   const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  //   const supabaseUrl = process.env.SUPABASE_URL;
  //   const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  //   const res = await fetch(
  //     `${supabaseUrl}/storage/v1/object/images/${fileName}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${supabaseKey}`,
  //         'Content-Type': file.mimetype,
  //         'x-upsert': 'true',
  //       },
  //       body: file.buffer,
  //     },
  //   );
  //   if (!res.ok) throw new Error('upload_failed');
  //   return `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;

  async upload(file: Express.Multer.File): Promise<string> {
    void file;
    // Mock — devuelve URL placeholder
    return `https://via.placeholder.com/300x300.png?text=QR`;
  }
}
