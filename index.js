const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
  const alexaResponse = {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Hola, soy tu asistente ChatGPT. ¿Qué quieres saber?"
      },
      shouldEndSession: false
    }
  };

  res.json(alexaResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
