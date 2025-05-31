const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 👉 Ruta GET para probar en navegador
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente! Alexa Skill Ready 🔥');
});

app.post('/', async (req, res) => {
  const requestType = req.body.request.type;

  if (requestType === 'LaunchRequest') {
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Hola, soy ChatGPT. ¿Sobre qué quieres que hablemos?"
        },
        shouldEndSession: false
      }
    });
  }

  if (requestType === 'IntentRequest') {
    const intent = req.body.request.intent;
    const userText = intent.slots?.mensaje?.value || "Dime algo";

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userText }]
      });

      const reply = completion.choices[0].message.content;

      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: reply
          },
          shouldEndSession: false
        }
      });
    } catch (error) {
      console.error(error);
      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Lo siento, ocurrió un error al consultar ChatGPT."
          },
          shouldEndSession: true
        }
      });
    }
  }

  // Otro tipo de request
  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "No entendí tu solicitud."
      },
      shouldEndSession: false
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});