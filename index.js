/* eslint-disable no-undef */
import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import mercadopago from 'mercadopago';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

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

// Verifica la conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

// Configura el SDK de Mercado Pago con tu Access Token de prueba
mercadopago.configure({
  access_token: 'TEST-369157968727148-103115-a8b315a9537190c54a577b084564e665-155309396'
});

// Ruta para obtener productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal server error');
  }
});

// Ruta para agregar un producto
app.post('/productos', async (req, res) => {
  const { title, description, price, image, stock } = req.body;
  if (!title || !description || !price || !image || !stock) {
    return res.status(400).send('All fields are required');
  }
  try {
    const result = await pool.query(
      'INSERT INTO productos (title, description, price, image, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, image, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Internal server error');
  }
});

// Ruta para eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Product not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Internal server error');
  }
});

// Ruta para actualizar un producto
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image, stock } = req.body;
  if (!title || !description || !price || !image || !stock) {
    return res.status(400).send('All fields are required');
  }
  try {
    const result = await pool.query(
      'UPDATE productos SET title = $1, description = $2, price = $3, image = $4, stock = $5 WHERE id = $6 RETURNING *',
      [title, description, price, image, stock, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Product not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Internal server error');
  }
});

// Ruta para el login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, role: user.role }, 'secret', {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({ auth: true, token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/create_preference', async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).send('No items provided');
  }

  let preference = {
    items: items.map(item => ({
      title: item.title,
      unit_price: parseInt(item.unit_price) / 100, // Convertimos centavos a la moneda original
      quantity: item.quantity,
    })),
    back_urls: {
      success: "www.youtube.com",
      failure: "www.youtube.com",
      pending: "www.youtube.com"
    },
    auto_return: "approved",
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.status(200).send({ id: response.body.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).send('Internal server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});