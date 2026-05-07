import 'dotenv/config';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const CITIES = [
  // La Paz
  { name: 'La Paz', department: 'La Paz' },
  { name: 'El Alto', department: 'La Paz' },
  { name: 'Viacha', department: 'La Paz' },
  { name: 'Caranavi', department: 'La Paz' },
  { name: 'Coroico', department: 'La Paz' },
  { name: 'Copacabana', department: 'La Paz' },
  { name: 'Desaguadero', department: 'La Paz' },
  { name: 'Tiwanaku', department: 'La Paz' },
  { name: 'Sorata', department: 'La Paz' },
  { name: 'Guanay', department: 'La Paz' },
  // Cochabamba
  { name: 'Cochabamba', department: 'Cochabamba' },
  { name: 'Quillacollo', department: 'Cochabamba' },
  { name: 'Sacaba', department: 'Cochabamba' },
  { name: 'Punata', department: 'Cochabamba' },
  { name: 'Arani', department: 'Cochabamba' },
  { name: 'Cliza', department: 'Cochabamba' },
  { name: 'Tarata', department: 'Cochabamba' },
  { name: 'Tiraque', department: 'Cochabamba' },
  { name: 'Villa Tunari', department: 'Cochabamba' },
  { name: 'Shinaota', department: 'Cochabamba' },
  // Santa Cruz
  { name: 'Santa Cruz de la Sierra', department: 'Santa Cruz' },
  { name: 'Montero', department: 'Santa Cruz' },
  { name: 'Warnes', department: 'Santa Cruz' },
  { name: 'Cotoca', department: 'Santa Cruz' },
  { name: 'Puerto Suárez', department: 'Santa Cruz' },
  { name: 'Camiri', department: 'Santa Cruz' },
  { name: 'Vallegrande', department: 'Santa Cruz' },
  { name: 'San Ignacio de Velasco', department: 'Santa Cruz' },
  { name: 'Concepción', department: 'Santa Cruz' },
  { name: 'Yapacaní', department: 'Santa Cruz' },
  // Oruro
  { name: 'Oruro', department: 'Oruro' },
  { name: 'Huanuni', department: 'Oruro' },
  { name: 'Challapata', department: 'Oruro' },
  { name: 'Llallagua', department: 'Oruro' },
  { name: 'Machacamarca', department: 'Oruro' },
  // Potosí
  { name: 'Potosí', department: 'Potosí' },
  { name: 'Uyuni', department: 'Potosí' },
  { name: 'Villazón', department: 'Potosí' },
  { name: 'Tupiza', department: 'Potosí' },
  { name: 'Colquechaca', department: 'Potosí' },
  // Sucre / Chuquisaca
  { name: 'Sucre', department: 'Chuquisaca' },
  { name: 'Monteagudo', department: 'Chuquisaca' },
  { name: 'Camargo', department: 'Chuquisaca' },
  { name: 'Villa Serrano', department: 'Chuquisaca' },
  // Tarija
  { name: 'Tarija', department: 'Tarija' },
  { name: 'Yacuiba', department: 'Tarija' },
  { name: 'Villamontes', department: 'Tarija' },
  { name: 'Bermejo', department: 'Tarija' },
  { name: 'Entre Ríos', department: 'Tarija' },
  // Beni
  { name: 'Trinidad', department: 'Beni' },
  { name: 'Riberalta', department: 'Beni' },
  { name: 'Guayaramerín', department: 'Beni' },
  { name: 'San Borja', department: 'Beni' },
  { name: 'Rurrenabaque', department: 'Beni' },
  // Pando
  { name: 'Cobija', department: 'Pando' },
  { name: 'Porvenir', department: 'Pando' },
];

async function main() {
  console.log('Seeding cities...');
  const client = await pool.connect();
  try {
    for (const city of CITIES) {
      const id = `city-${city.name.toLowerCase().replace(/[\s]+/g, '-').replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u').replace(/[^a-z0-9-]/g, '')}`;
      await client.query(
        `INSERT INTO cities (id, name, department) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [id, city.name, city.department],
      );
    }
    console.log(`Seeded ${CITIES.length} cities.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
