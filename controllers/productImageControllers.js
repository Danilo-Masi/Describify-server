import dotenv from 'dotenv';
import openai from '../config/openai.js';

dotenv.config();

// Messaggi di errore/successo
const MESSAGES = {
    OPEN_AI_ERROR: 'Errore durante l\'analisi dell\'immagine con OpenAI',
    SERVER_ERROR: 'Errore del server',
    SUCCESS: 'Analisi immagine completata con successo',
};

export const analyzeImage = async (req, res) => {
    try {
        // Controlla se il file è presente nella richiesta
        if (!req.file) {
            return res.status(400).json({ error: 'Immagine mancante nella richiesta' });
        }

        // Converte il buffer dell'immagine in Base64
        const base64Image = req.file.buffer.toString('base64');

        // Prepara il payload per l'API di OpenAI
        const payload = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analizza l'immagine e forniscimi le seguenti informazioni: categoria, colore e marchio. Rispondi solo nel formato specificato: 'categoria: <categoria>', 'colore: <colore>', 'marchio: <marchio>'."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };

        // Esegui la richiesta all'API di OpenAI
        const response = await openai.chat.completions.create(payload);

        // Verifica se la risposta è valida
        if (!response.choices?.length) {
            console.error('BACKEND: Nessuna risposta valida da OpenAI');
            return res.status(500).json({ error: MESSAGES.OPEN_AI_ERROR });
        }

        // Estrai il testo di risposta
        const responseText = response.choices[0].message.content;

        // Invio della risposta al client
        return res.json({ message: MESSAGES.SUCCESS, responseText });

    } catch (error) {
        console.error('SERVER: Errore durante l\'analisi dell\'immagine', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR, details: error.message });
    }
};