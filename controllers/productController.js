import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import openai from '../config/openai';

dotenv.config();

export const productGeneration = async (req, res) => {
    try {
        // Prende i valori del prodotto inseriti dall'utente
        const { prompt, plan } = req.body;
        // Verifica che i valori siano validi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Funzione per la generazione del contenuto
        const response = await openai.chat.completions.create({
            model: plan === "standard" ? "gpt-3.5-turbo" : "gpt-4",
            messages: [{
                role: "assistant",
                content: `Descrivi brevemente e convincentemente un articolo di seconda mano per la vendita online con queste caratteristiche: ${prompt}. Metti in luce i vantaggi e lo stato dell'oggetto per attirare acquirenti su piattaforme come Vinted, Subito, eBay. Limite di parole: massimo 50.`
            }],
            max_tokens: 200,
            temperature: 0.5,
            top_p: 1,
        });
        // Invio email riuscito
        res.json({ message: "Success", description: response.choices[0].message.content });
    } catch (error) {
        // Se si verifica un errore, stampa lo stack di errore completo
        console.error("API error:", error.stack);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
