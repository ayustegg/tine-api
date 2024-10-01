const express = require('express');
const morgan = require('morgan'); // Importar morgan
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Middleware para parsear el body de las peticiones
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las rutas

// Configuración de logging
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // Crear directorio si no existe
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream })); // Loguear en el archivo access.log

// Recuperamos el id que ha generado el FRONT
app.get('/id', async (req, res) => {
  try {
      const id = await fs.promises.readFile('id.txt', 'utf8'); // Usa promesas para evitar el callback hell
      res.send(id);
  } catch (error) {
      console.error("Error reading ID:", error);
      res.status(500).send('Error reading ID');
  }
});

// POST para guardar el id que ha generado el FRONT Y hacer la llamada a ese ID
app.post('/id', (req, res) => {
  const { id } = req.body;
  if (!id) {
      return res.status(400).send('Falta el id');
  }
  fs.writeFile('id.txt', id, (error) => {
      if (error) {
          console.error("Error saving ID:", error);
          return res.status(500).send('Error saving ID');
      }
      res.send('Id guardado');
  });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});