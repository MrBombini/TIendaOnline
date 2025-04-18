const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const router = require('./soap.js');

app.use(cors());
app.use(express.json()); // Recomendado si recibes JSON en requests

app.use('/countries', router);

// Corrección aquí: usar `app.listen`
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
