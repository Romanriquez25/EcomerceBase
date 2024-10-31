import bcrypt from 'bcryptjs';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'Clow2508!',
  port: 5432,
});

const insertUser = async (username, password, role) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );
    console.log('User inserted:', result.rows[0]);
  } catch (error) {
    console.error('Error inserting user:', error);
  }
};

// Inserta un usuario de ejemplo
insertUser('rodrigo', '1234', 'owner');