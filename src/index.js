const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
require('dotenv').config();

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
    password: 'mibo1992',
    database: 'netflix',
  });

  await connection.connect();
  return connection;
}


//endpoint para todas las peliculas

server.get('/movies', async (req, res) => {
  const { genre, sort } = req.query;

  const conex = await getConnection();

  let listMovies = [];
  if (genre === '') {
    const selectMovie = `select * from movies order by titleMovie ${sort}`;
    const [resultMovies] = await conex.query(selectMovie);
    listMovies = resultMovies;
  } else {
    const selectMovie = `select * from movies where genreMovie = ? order by titleMovie ${sort}`;
    const [resultMovies] = await conex.query(selectMovie, [genre]);
    listMovies = resultMovies;
  }
  conex.end();
  res.json({
    success: true,
    movies: listMovies,
  });
});


//ENPOINT PARA MOTOR DE PLANTILLAS

server.get('/movies/:movieId', (req, res) => {

  const movieId = req.params.id;

  console.log(movieId)
});




// servidor de estaticos
const staticServer = 'src/public-react';
server.use(express.static(staticServer));

// servidor de estaticos
const staticServer1 = 'src/public.movies-images';
server.use(express.static(staticServer1));

