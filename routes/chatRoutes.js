import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat",
    body('prompt').trim().isLength({ min: 1 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { prompt } = req.body;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "assistant",
                    content: `Genera una descrizione accattivante e informativa per un prodotto di seconda mano destinato alla vendita online. Il prodotto ha queste caratteristiche: ${prompt}. 
                    Includi nel testo punti chiave che potrebbero interessare un potenziale acquirente, come lo stato di conservazione, l'unicità del design, la versatilità d'uso 
                    e qualsiasi altro dettaglio che possa valorizzare il prodotto. Assicurati che la descrizione sia ottimizzata per siti di vendita come Vinted, Subito, eBay, 
                    evidenziando perché sarebbe una buona aggiunta al guardaroba o alla collezione dell'acquirente.`
                }],
                max_tokens: 200,
                temperature: 0.5,
                top_p: 1,
            });
            res.json({ message: "Success", description: response.choices[0].message.content });
        } catch (error) {
            console.error("OpenAI Error:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
);

export default router;
