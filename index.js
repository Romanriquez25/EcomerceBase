import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send('No token provided.');

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(500).send('Failed to authenticate token.');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const verifyOwner = (req, res, next) => {
  if (req.userRole !== 'owner') {
    return res.status(403).send('Access denied.');
  }
  next();
};

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
    const productos = result.rows.map(producto => ({
      ...producto,
      price: Number(producto.price),
    }));
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Endpoint para agregar productos (protegido)
app.post('/productos', verifyToken, verifyOwner, async (req, res) => {
  const { title, description, price, image, stock } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO productos (title, description, price, image, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, image, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// Endpoint para modificar productos (protegido)
app.put('/productos/:id', verifyToken, verifyOwner, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image, stock } = req.body;
  try {
    const result = await pool.query(
      'UPDATE productos SET title = $1, description = $2, price = $3, image = $4, stock = $5 WHERE id = $6 RETURNING *',
      [title, description, price, image, stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al modificar producto:', err);
    res.status(500).json({ error: 'Error al modificar producto' });
  }
});

// Endpoint para eliminar productos (protegido)
app.delete('/productos/:id', verifyToken, verifyOwner, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});