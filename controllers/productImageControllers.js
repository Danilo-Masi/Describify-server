import dotenv from 'dotenv';
import openai from '../config/openai.js';
import supabase from '../config/supabase.js';
import jwt from 'jsonwebtoken';

dotenv.config();

// Messaggi di errore/successo
const MESSAGES = {
    TOKEN_ERROR: 'Token mancante o non valido',
    SUPABASE_ERROR: 'Errore durante la lettura dei dati dal DB di Supabse',
    NO_USER_ERROR: 'Nessun utente trovato con l\'Id specificato',
    CREDITS_ERROR: 'Crediti insufficienti',
    FILE_NULL_ERROR_MESSAGE: 'Immagine mancante o non valida, impossibile procedere con la richiesta',
    OPEN_AI_ERROR: 'Errore durante l\'analisi dell\'immagine con OpenAI',
    UPDATE_ERROR_MESSAGE: 'Errore durante l\'aggiornamento dei crediti nel DB di Suapabse',
    SERVER_ERROR: 'Errore del server',
    SUCCESS: 'Analisi immagine completata con successo',
};

export const analyzeImage = async (req, res) => {

    // Estrai il token JWT dall'header di autorizzazione
    const token = req.headers.authorization?.split(' ')[1];

    // Verifica che non ci sia nessun errore nel token passato nell'header della richiesta
    if (!token) {
        console.error('BACKEND: Token mancante o non valido');
        return res.status(401).json({ error: MESSAGES.TOKEN_ERROR });
    }

    // Decodifica ed estrae l'ID dell'utente dal JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Funzione SQL per prelevare il "numero_crediti" dal DB di Supabase
    const { data, error: userError } = await supabase
        .from('users')
        .select('numero_crediti')
        .eq('id', decoded.id);

    // Verifica che non ci siano errori generici
    if (userError) {
        console.error('BACKEND: Errore durante la lettura dei dati dal DB di Supabase:', userError.message);
        return res.status(500).json({ error: MESSAGES.SUPABASE_ERROR });
    }

    // Verifica che sia presente un utente con l'ID specificato
    if (!data || data.length === 0) {
        console.log('BACKEND: Nessun utente trovato con l\'Id specificato');
        return res.status(404).json({ error: MESSAGES.NO_USER_ERROR });
    }

    const numeroCrediti = data[0].numero_crediti;

    // Controlla se l'utente ha un numero di crediti > 0
    if (numeroCrediti <= 0) {
        console.error('BACKEND: Crediti insufficienti');
        return res.status(401).json({ error: MESSAGES.CREDITS_ERROR });
    }

    try {
        // Controlla se il file è presente nella richiesta
        if (!req.file) {
            console.error('BACKEND: Immagine mancante o non valida, impossibile procedere con la richiesta');
            return res.status(400).json({ error: MESSAGES.FILE_NULL_ERROR_MESSAGE });
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
                            text: "Analizza l'immagine e forniscimi le seguenti informazioni: categoria, colore e marchio. Rispondi solo nel formato specificato: 'categoria: <categoria>', 'colore: <colore>', 'marchio: <marchio>'. Non aggiungere virgole o segni."
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

        // Verifica che ci sia una risposta valida dall'API di OPENAI
        if (!response.choices?.length) {
            console.error('BACKEND: Nessuna risposta valida da OpenAI');
            return res.status(500).json({ error: MESSAGES.OPEN_AI_ERROR });
        }

        // Estrai il testo di risposta
        const responseText = response.choices[0].message.content;

        // Aggiorna il numero di crediti nel DB di Supabase
        const { error: updateError } = await supabase
            .from('users')
            .update({ numero_crediti: numeroCrediti - 1 })
            .eq('id', decoded.id);

        // Verifica che non ci siano problemi nell'aggiornamento dei crediti
        if (updateError) {
            console.error('BACKEND: Errore durante l\'aggiornamento dei crediti:', updateError.message);
            return res.status(500).json({ error: MESSAGES.UPDATE_ERROR_MESSAGE });
        }

        // Invio della risposta di successo al client
        return res.json({ message: MESSAGES.SUCCESS, responseText });

    } catch (error) {
        console.error('SERVER: Errore durante l\'analisi dell\'immagine', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR });
    }
};