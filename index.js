import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';

const { Pool } = pkg;

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS para todas las solicitudes

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'Clow2508!',
  port: 5432,
});

// Endpoint de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Conexión exitosa a la base de datos', time: result.rows[0].now });
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    res.status(500).json({ error: 'Error al conectar a la base de datos' });
  }
});

app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los productos:', err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.post('/carrito', async (req, res) => {
  const { usuario_id, producto_id, cantidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO carritos (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, producto_id, cantidad]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});