import fs from 'fs';
import csv from 'csv-parser';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'Clow2508!',
  port: 5432,
});

const cargarProductos = async () => {
  const productos = [];

  fs.createReadStream('data/productos.csv')
    .pipe(csv())
    .on('data', (row) => {
      productos.push(row);
    })
    .on('end', async () => {
      console.log('Archivo CSV procesado exitosamente');
      try {
        for (const producto of productos) {
          const { title, description, price, image, stock } = producto;
          await pool.query(
            'INSERT INTO productos (title, description, price, image, stock) VALUES ($1, $2, $3, $4, $5)',
            [title, description, price, image, stock]
          );
        }
        console.log('Productos cargados exitosamente');
      } catch (err) {
        console.error('Error al cargar los productos:', err);
      } finally {
        pool.end();
      }
    });
};

cargarProductos();