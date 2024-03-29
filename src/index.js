const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
require('dotenv').config();
server.set('view engine', 'ejs');

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

server.get('/movies/:IdMovie', async (req, res) => {

  const conex = await getConnection();

  console.log("ajjajajaja", req.params.IdMovie)

  const movieById = req.params.IdMovie;

  const foundMovie = "SELECT * FROM movies WHERE IdMovie = ?";

  const [resultMovie] = await conex.query(foundMovie, [movieById]);


  console.log(resultMovie, "esto es");
  res.render('movie', resultMovie[0]);

});

//ENDPOINT para recibir email y contraseña de la usuaria

server.post("/signup", async (req, res) => {

  const data = req.body;
  const { id, email, password } = data;

  const conex = await getConnection();

  const sql = "insert into users (idUser, email, passwordUser) values (?,?,?)" //nombres exactos de las columnas de la BS

  const [result] = await conex.query(sql, [id, email, password]);

  console.log("este es el objeto de resultados", result)

  res.json({
    success: true,
    id: result.insertId // id que generó MySQL para la nueva fila--INSERTID aparece en la consola de la terminal que es del objeto que devuelve results

  });

});




// servidor de estaticos
const staticServer = 'src/public-react';
server.use(express.static(staticServer));

// servidor de estaticos
const staticServer1 = 'src/public.movies-images';
server.use(express.static(staticServer1));

// servidor de estaticos para el estilo
const staticServerStyle = 'src/public-css';
server.use(express.static(staticServerStyle));

