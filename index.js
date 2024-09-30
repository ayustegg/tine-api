const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const cors = require('cors');

// Middleware para parsear el body de las peticiones
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las rutas


//Recuperamos el id que ha generado el FRONT
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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
