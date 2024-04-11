import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const signupToWaitlist = async (req, res) => {
    const { email } = req.body;
    const waitlistId = process.env.WAITLIST_ID;
    const referralLink = process.env.WAITLIST_URL;

    if (!email) {
        return res.status(400).json({ error: "Please enter your email" });
    }

    try {
        const response = await fetch("https://api.getwaitlist.com/api/v1/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                waitlist_id: waitlistId,
                referral_link: referralLink,
            }),
        });

        if (!response.ok) {
            // Assicurati di ottenere il corpo della risposta solo dopo aver verificato che la richiesta sia riuscita
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred while signing up to the waitlist.");
        }

        const data = await response.json();
        return res.status(200).json(data);
        
    } catch (error) {
        console.error("Signup to Waitlist Error:", error);
        return res.status(500).json({ error: error.message || "An error occurred" });
    }
};
