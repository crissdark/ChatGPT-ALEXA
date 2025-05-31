const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    const userInput = req.body.request.intent?.slots?.text?.value || 'Hola';

    // Enviar a ChatGPT (reemplaza TU_API_KEY con la tuya)
    const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
        },
        {
            headers: {
                Authorization: `Bearer TU_API_KEY`,
                'Content-Type': 'application/json',
            },
        }
    );

    const reply = openaiResponse.data.choices[0].message.content;

    res.json({
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: reply,
            },
            shouldEndSession: false,
        },
    });
});

app.listen(port, () => console.log(`Servidor Alexa-GPT en ${port}`));