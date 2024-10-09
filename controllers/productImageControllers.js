import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Messaggi di errore/successo
const OPEN_AI_ERROR_MESSAGE = 'Errore durante l\'analisi dell\'immagine con OpenAI';
const SERVER_ERROR_MESSAGE = 'Errore del server';
const SUCCESS_MESSAGE = 'Analisi immagine completata con successo';

export const analyzeImage = async (req, res) => {
    try {
        // Verifica se l'immagine è stata caricata
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'Immagine mancante nella richiesta' });
        }

        // Legge il file e lo codifica in Base64
        const imagePath = req.file.path;
        const imageBase64 = fs.readFileSync(imagePath, 'base64');

        // Impostazioni dell'header per la richiesta a OpenAI
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };

        // Creazione del payload per OpenAI API
        const payload = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Quali sono il marchio, la categoria, il colore e la taglia di questo oggetto?"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };

        // Invio della richiesta all'API di OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });

        // Rimozione del file temporaneo
        fs.unlinkSync(imagePath);

        // Controlla se OpenAI ha fornito una risposta valida
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const analysisResult = response.data.choices[0].message.content;
            return res.status(200).json({ message: SUCCESS_MESSAGE, result: analysisResult });
        } else {
            return res.status(500).json({ error: OPEN_AI_ERROR_MESSAGE, details: 'Risposta non valida da OpenAI' });
        }
    } catch (error) {
        console.error('SERVER: Errore durante l\'analisi dell\'immagine', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};