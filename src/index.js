const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//conexión a la bases de datos
async function getConnection() {
  //creary configurar la conexion
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'netflix',
  });

  connection.connect();
  return connection;
}


//endpoint para todas las peliculas
server.get('/movies', async (req, res) => {
  //require para cuando envien datos
  //response para enviar desde el server datos al front

  //Obtener los datos de la bases de datos
  // 1. Obtener la conexion
  const conn = await getConnection();

  //. 2. Consulta que quiero a la bd: obtener todas las movies
  const queryMovies = 'SELECT * FROM movies';

  //3. Ejecutar la consulta
  const [results, fields] = await conn.query(queryMovies);

  console.log(fields);
  console.log(results);

  //4. Cerra la conexión
  conn.end();
  res.json({
    success: true,
    movies: results
  });
});