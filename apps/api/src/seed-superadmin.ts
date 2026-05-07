import 'dotenv/config';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Cambia estos valores antes de ejecutar
const SUPERADMIN = {
  name: 'Super Admin',
  email: 'superadmin@rutaya.bo',
  password: 'superadmin123',
  phone: '00000000',
  city: 'La Paz',
};

async function main() {
  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT id FROM companies WHERE email = $1', [SUPERADMIN.email]);
    if (existing.rows.length > 0) {
      console.log(`Superadmin ya existe con email: ${SUPERADMIN.email}`);
      return;
    }

    const hashed = await bcrypt.hash(SUPERADMIN.password, 10);
    const id = randomUUID();
    const now = new Date();

    await client.query(
      `INSERT INTO companies (id, name, email, password, phone, city, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, 'superadmin', $7, $8)`,
      [id, SUPERADMIN.name, SUPERADMIN.email, hashed, SUPERADMIN.phone, SUPERADMIN.city, now, now],
    );

    console.log('Superadmin creado:');
    console.log(`  Email:    ${SUPERADMIN.email}`);
    console.log(`  Password: ${SUPERADMIN.password}`);
    console.log('  ⚠️  Cambia la contraseña después del primer acceso.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
